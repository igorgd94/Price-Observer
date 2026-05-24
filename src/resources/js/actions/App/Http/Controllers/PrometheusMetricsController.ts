import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PrometheusMetricsController::index
 * @see app/Http/Controllers/PrometheusMetricsController.php:14
 * @route '/metrics/prometheus'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/metrics/prometheus',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrometheusMetricsController::index
 * @see app/Http/Controllers/PrometheusMetricsController.php:14
 * @route '/metrics/prometheus'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrometheusMetricsController::index
 * @see app/Http/Controllers/PrometheusMetricsController.php:14
 * @route '/metrics/prometheus'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrometheusMetricsController::index
 * @see app/Http/Controllers/PrometheusMetricsController.php:14
 * @route '/metrics/prometheus'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrometheusMetricsController::index
 * @see app/Http/Controllers/PrometheusMetricsController.php:14
 * @route '/metrics/prometheus'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrometheusMetricsController::index
 * @see app/Http/Controllers/PrometheusMetricsController.php:14
 * @route '/metrics/prometheus'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrometheusMetricsController::index
 * @see app/Http/Controllers/PrometheusMetricsController.php:14
 * @route '/metrics/prometheus'
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
const PrometheusMetricsController = { index }

export default PrometheusMetricsController