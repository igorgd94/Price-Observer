import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CacheController::index
 * @see app/Http/Controllers/CacheController.php:11
 * @route '/cache'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/cache',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CacheController::index
 * @see app/Http/Controllers/CacheController.php:11
 * @route '/cache'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CacheController::index
 * @see app/Http/Controllers/CacheController.php:11
 * @route '/cache'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CacheController::index
 * @see app/Http/Controllers/CacheController.php:11
 * @route '/cache'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CacheController::index
 * @see app/Http/Controllers/CacheController.php:11
 * @route '/cache'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CacheController::index
 * @see app/Http/Controllers/CacheController.php:11
 * @route '/cache'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CacheController::index
 * @see app/Http/Controllers/CacheController.php:11
 * @route '/cache'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
const cache = {
    index: Object.assign(index, index),
}

export default cache