export function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

export function json(response) {
  return response.json()
}

export function queryParams(params) {
	let res = []
	for (let k of Object.keys(params)) {
		res.push(`${k}=${encodeURIComponent(params[k])}`)
	}
	return "?"+res.join("&")
}

export function idFromUri(uri) {
  return uri.substring(uri.lastIndexOf('/') + 1)
}