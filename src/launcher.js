const createPublicTokenProvider = (apiUrl, apiKey) => () => {
  if (!apiUrl) {
    throw new Error('Missing api url');
  }
  if (!apiKey) {
    throw new Error('Missing api key');
  }
  return fetch(`${apiUrl}/sdk/v1/token`, {
    method: 'POST',
    body: JSON.stringify({}),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      apiKey,
    },
  }).then((res) => res.json());
};

const defaultLink = 'https://cdn.getid.cloud/sdk/getid-web-sdk-v5.1.0.min.js';

function getScriptLink(apiUrl) {
  try {
    return fetch(`${apiUrl}/sdk/v1/script-link`, {
      method: 'POST',
      body: JSON.stringify({}),
    }).then((res) => res.json());
  } catch (e) {
    return { };
  }
}

const init = (containerId, token, originCfg, callbacks, ...args) => {
  const cfg = {
    ...originCfg,
    containerId,
    ...callbacks,
  };

  getScriptLink(cfg.apiUrl).then(({ scriptLink = defaultLink }) => {
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.src = scriptLink.replace('getid-web-sdk-v4.min.js', 'getid-web-sdk-v5.1.0.min.js');

    document.getElementsByTagName('body')[0].appendChild(script);
    const tokenProvider = typeof token === 'string' ? createPublicTokenProvider(cfg.apiUrl, token) : token;

    script.onload = () => {
      if (window.getidWebSdk) {
        window.getidWebSdk.init(
          cfg,
          tokenProvider,
          ...args,
        );
      }
    };
  });
};

export { init, createPublicTokenProvider };
