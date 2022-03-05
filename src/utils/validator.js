export const isValidPasswd = passwd => {
  const reg = /^[a-zA-Z]\w{8,18}$/
  return reg.test(passwd)
}
export const isValidNickname = passwd => {
  const reg = /^[a-zA-Z]\w{2,18}$/
  return reg.test(passwd)
}

export const isValidLayerName = layerName => {
  const reg = /^[a-zA-Z]\w{0,18}$/
  return reg.test(layerName)
}
