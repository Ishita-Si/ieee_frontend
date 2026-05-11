import React from 'react';

const loaderStyles = `
  .ieee-loader {
    width: 45px;
    height: 30px;
    animation: ieee-loader-anim 2s infinite linear;
  }
  .ieee-loader.small {
    width: 30px;
    height: 20px;
  }
  .ieee-loader.large {
    width: 60px;
    height: 40px;
  }
  @keyframes ieee-loader-anim {
    0%,
    25% {
      background: linear-gradient(#e50021 0 0) 50% 0/66% 100% no-repeat;
    }
    25.1%,
    50% {
      background: linear-gradient(#004ce4 0 0) 0 0/100% 50% no-repeat,
        linear-gradient(#004ce4 0 0) 0 0/33% 100% no-repeat;
    }
    50.1%,
    75% {
      background: linear-gradient(#00e622 0 0) 100% 0/66% 50% no-repeat,
        linear-gradient(#00e622 0 0) 0 100%/66% 50% no-repeat;
    }
    75.1%,
    100% {
      background: linear-gradient(#9d0be6 0 0) 0 100%/100% 50% no-repeat,
        linear-gradient(#9d0be6 0 0) 50% 0 /33% 50% no-repeat;
    }
  }
`;

const Loader = ({ className = "", size = "default" }) => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: loaderStyles }} />
      <div className={`ieee-loader ${size} ${className}`} />
    </>
  );
};

export default Loader;
