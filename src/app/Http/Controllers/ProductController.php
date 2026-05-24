<?php

namespace App\Http\Controllers;

use App\Jobs\MonitorProductJob;
use App\Models\Product;
use App\Support\CacheKeys;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProductController extends Controller
{
    public function index(): Response
    {
        $query = Product::query();

        if (request('search')) {

            $query->where(
                'name',
                'like',
                '%' . request('search') . '%'
            );
        }

        if (request('status')) {

            $query->where(
                'is_active',
                request('status') === 'active'
            );
        }

        match (request('sort')) {

            'price_asc' =>
            $query->orderBy('current_price'),

            'price_desc' =>
            $query->orderByDesc('current_price'),

            'latest' =>
            $query->latest(),

            default =>
            $query->latest(),
        };

        $page = request()->get('page', 1);

        $perPage = 10;

        /*
        |--------------------------------------------------------------------------
        | Cache Key
        |--------------------------------------------------------------------------
        |
        | Incluímos filtros no cache key para evitar:
        | - páginas misturadas
        | - filtros incorretos
        | - ordenações erradas
        |
        */

        $cacheKey = sprintf(
            'products.page.%s.search.%s.status.%s.sort.%s',

            $page,

            request('search', 'none'),

            request('status', 'all'),

            request('sort', 'latest'),
        );

        /*
        |--------------------------------------------------------------------------
        | Cache Metrics
        |--------------------------------------------------------------------------
        */

        if (Cache::has($cacheKey)) {

            Cache::increment(
                CacheKeys::totalHits()
            );

            Cache::increment(
                CacheKeys::keyHits($cacheKey)
            );

            Cache::put(
                CacheKeys::keyLastHitAt($cacheKey),
                now()->toDateTimeString()
            );

            Cache::put(
                CacheKeys::lastHitAt(),
                now()->toDateTimeString()
            );

        } else {

            Cache::increment(
                CacheKeys::totalMisses()
            );

            Cache::increment(
                CacheKeys::keyMisses($cacheKey)
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Cache
        |--------------------------------------------------------------------------
        */

        $cached = Cache::remember(

            $cacheKey,

            now()->addMinutes(10),

            function () use ($query, $perPage) {

                $products = $query
                    ->paginate($perPage);

                return [

                    'items' => collect($products->items())

                        ->map(fn ($product) => [

                            'id' => $product->id,

                            'name' => $product->name,

                            'source' => $product->source,

                            'url' => $product->url,

                            'target_price' => $product->target_price,

                            'current_price' => $product->current_price,

                            'is_active' => $product->is_active,

                            'last_checked_at' => $product->last_checked_at ? $product->last_checked_at->toISOString() : null,

                            'created_at' => $product->created_at->toISOString(),
                        ])

                        ->toArray(),

                    'total' => $products->total(),

                    'per_page' => $products->perPage(),

                    'current_page' => $products->currentPage(),

                    'last_page' => $products->lastPage(),
                ];
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Rebuild Paginator
        |--------------------------------------------------------------------------
        */

        $products = new LengthAwarePaginator(

            items: $cached['items'],

            total: $cached['total'],

            perPage: $cached['per_page'],

            currentPage: $cached['current_page'],

            options: [
                'path' => request()->url(),
                'query' => request()->query(),
            ]
        );

        return Inertia::render('products/Index', [

            'products' => $products,

            'filters' => [

                'search' => request('search'),

                'status' => request('status'),

                'sort' => request('sort'),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('products/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],

            'source' => ['nullable', 'string', 'max:255'],

            'url' => [
                'required',
                'url',
                'unique:products,url',
            ],

            'target_price' => ['nullable', 'numeric', 'min:0'],
        ]);

        $product = Product::create([
            ...$validated,

            'user_id' => null,

            'current_price' => null,

            'is_active' => true,

            'last_checked_at' => null,
        ]);

        MonitorProductJob::dispatch($product);
        Cache::flush();

        return redirect()
            ->route('products.index');
    }

    public function show(Product $product): Response
    {
        $product->load([

            'priceHistories' => fn ($query) =>

            $query
                ->latest('captured_at')
                ->take(30),
        ]);

        return Inertia::render('products/Show', [

            'product' => $product,
        ]);
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('products/Edit', [
            'product' => $product,
        ]);
    }

    public function update(
        Request $request,
        Product $product
    ): RedirectResponse {

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],

            'source' => ['nullable', 'string', 'max:255'],

            'url' => [
                'required',
                'url',
                'unique:products,url,' . $product->id,
            ],

            'target_price' => [
                'nullable',
                'numeric',
                'min:0',
            ],
        ]);

        $product->update($validated);
        Cache::flush();

        return redirect()
            ->route('products.show', $product);
    }

    public function destroy(
        Product $product
    ): RedirectResponse {

        $product->delete();
        Cache::flush();

        return redirect()
            ->route('products.index');
    }
}
