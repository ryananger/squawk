import React, {useEffect, useRef} from 'react';

const AdsterraAd = function({adKey, width, height}) {
  const ad = useRef(null);

  useEffect(()=>{
    // Create the script element
    const script1 = document.createElement('script');
    script1.type = 'text/javascript';
    script1.innerHTML = `
      atOptions = {
        'key' : '${adKey}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;
    
    // Create the second script that points to Adsterra's invoke.js
    const script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.src = `//www.topcreativeformat.com/${adKey}/invoke.js`;

    // Append both scripts to the div where the ad will be placed
    ad.current.appendChild(script1);
    ad.current.appendChild(script2);

    // Cleanup: Remove scripts when component unmounts
    return () => {
      ad.current.removeChild(script1);
      ad.current.removeChild(script2);
    };
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div ref={ad} className='tallAd' style={{width: width + 'px', height: height + 'px'}}>
      {/* Ad will be injected here */}
    </div>
  );
};

export default AdsterraAd;