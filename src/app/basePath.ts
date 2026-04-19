export function normalizeRouterBasename(baseUrl: string) {
  if (!baseUrl || baseUrl === "/") {
    return "/";
  }

  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

export function resolveBasePath(baseUrl: string, targetPath: string) {
  const normalizedBaseUrl =
    !baseUrl || baseUrl === "/"
      ? "/"
      : baseUrl.endsWith("/")
        ? baseUrl
        : `${baseUrl}/`;
  const normalizedTargetPath = targetPath.startsWith("/") ? targetPath.slice(1) : targetPath;

  return `${normalizedBaseUrl}${normalizedTargetPath}`;
}