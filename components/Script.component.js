import Script from 'next/script';

const ScriptComponent = () => {
  return (
    <>
      <Script
        src='https://www.googletagmanager.com/gtag/js?id=UA-73657316-2'
        strategy='afterInteractive'
      />
      <Script id='google-analytics' strategy='afterInteractive'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', 'UA-73657316-2');
          `}
      </Script>
      <Script id='hotjar-analytics' strategy='afterInteractive'>
        {`
          (function (h, o, t, j, a, r) {
            h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments) };
            h._hjSettings = { hjid: 1970842, hjsv: 6 };
            a = o.getElementsByTagName('head')[0];
            r = o.createElement('script'); r.async = 1;
            r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
            a.appendChild(r);
          })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
        `}
      </Script>
    </>
  );
};

export default ScriptComponent;
