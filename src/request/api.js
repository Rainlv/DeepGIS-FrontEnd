import { del, download, get, post } from './http'
import { baseGeoserverUrl } from '@/config'

const wfsDefaultParam = {
  SERVICE: 'WFS',
  VERSION: '1.1.0',
  OUTPUTFORMAT: 'application/json'
}
const wcsDefaultParam = {
  SERVICE: 'WCS',
  VERSION: '2.0.1',
  format: 'image/tiff'
}
// 后端请求
// ------------------
// 地图相关
export const geoserver_create_table = p => post('/api/geoserver/create_table', p)
export const geoserver_get_user_feature_list = p => get('/api/geoserver/get_user_features', p)
export const geoserver_delete_asset = p => del('/api/geoserver/delete_asset', p)
export const geoserver_download_feature_asset = p => download('/api/geoserver/download_features', p)
export const geoserver_download_raster_asset = layerName => download(baseGeoserverUrl,
  {
    REQUEST: 'GetCoverage', ...wcsDefaultParam,
    coverageId: layerName,
  }, {}, 'tif'
)

// 用户
export const auth_login = p => post('/auth/jwt/login', p, false)
export const auth_register = p => post('/auth/register', p, true)
export const user_info = () => get('users/me', null)

// Coder
export const get_coder_url = p => get('/api/coder/get_container', p)

// Geoserver请求
// ------------------

const baseGeoserverGet = (param) => get(baseGeoserverUrl, param)

const geoserverWFSGet = (type, layerName) => baseGeoserverGet({
  REQUEST: type,
  ...wfsDefaultParam,
  TYPENAME: layerName
})
const geoserverWCSGet = (type, layerName) => baseGeoserverGet({
  REQUEST: type,
  ...wcsDefaultParam,
  coverageId: layerName
})

export const geoserver_get_feature_type = layerName => geoserverWFSGet('DescribeFeatureType', layerName)
export const geoserver_wcs = layerName => geoserverWCSGet('GetCoverage', layerName)
