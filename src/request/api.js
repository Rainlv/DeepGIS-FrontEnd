import { del, download, get, post } from './http'
import { baseGeoserverUrl } from '@/config'

// 后端请求
// ------------------
// 地图相关
export const geoserver_create_table = p => post('/api/geoserver/create_table', p)
export const geoserver_get_user_feature_list = p => get('/api/geoserver/get_user_features', p)
export const geoserver_delete_asset = p => del('/api/geoserver/delete_asset', p)
export const geoserver_download_asset = p => download('/api/geoserver/download_features', p)

// 用户
export const auth_login = p => post('/auth/jwt/login', p, false)
export const auth_register = p => post('/auth/register', p, true)
export const user_info = () => get('users/me', null)

// Geoserver请求
// ------------------
const wfsDefaultParam = {
  SERVICE: 'WFS',
  VERSION: '1.1.0',
  OUTPUTFORMAT: 'application/json'
}
/**
 * Geoserver WFS请求
 * @param {String} type [WFS操作类型]
 * @param {String} layerName [图层名]
 */
const geoserver_get = (type, layerName) => get(baseGeoserverUrl, {
  REQUEST: type,
  ...wfsDefaultParam,
  TYPENAME: layerName
})

export const geoserver_get_feature_type = layerName => geoserver_get('DescribeFeatureType', layerName)
