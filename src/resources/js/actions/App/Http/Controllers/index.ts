import PrometheusMetricsController from './PrometheusMetricsController'
import CacheController from './CacheController'
import JobController from './JobController'
import MetricsController from './MetricsController'
import DashboardController from './DashboardController'
import ProductController from './ProductController'
import Settings from './Settings'
const Controllers = {
    PrometheusMetricsController: Object.assign(PrometheusMetricsController, PrometheusMetricsController),
CacheController: Object.assign(CacheController, CacheController),
JobController: Object.assign(JobController, JobController),
MetricsController: Object.assign(MetricsController, MetricsController),
DashboardController: Object.assign(DashboardController, DashboardController),
ProductController: Object.assign(ProductController, ProductController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers