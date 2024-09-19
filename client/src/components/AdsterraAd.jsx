import React, {useEffect, useRef} from 'react';

const AdsterraAd = function() {
  const ad = useRef(null);

  useEffect(()=>{
    // Create the script element
    const script1 = document.createElement('script');
    script1.type = 'text/javascript';
    script1.innerHTML = `
      atOptions = {
        'key' : '115bdc4d67a6e86c1bfa586be28dccc2',
        'format' : 'iframe',
        'height' : 600,
        'width' : 160,
        'params' : {}
      };
    `;
    
    // Create the second script that points to Adsterra's invoke.js
    const script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.src = '//www.topcreativeformat.com/115bdc4d67a6e86c1bfa586be28dccc2/invoke.js';

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
    <div ref={ad} className='tallAd'>
      {/* Ad will be injected here */}
    </div>
  );
};

export default AdsterraAd;