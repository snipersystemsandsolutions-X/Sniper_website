import gsap from "gsap";
import { useEffect, useRef } from "react";
import imgSrc from "@/assets/sniper-logo-black.png";

interface PreloaderProps {
  onComplete: () => void;
}

const loaderCss = `
  .sniper-loader {
    --duration: 3s;
    --primary: rgba(0, 0, 0, 1);
    --primary-light: #333333;
    --primary-rgba: rgba(0, 0, 0, 0);
    width: 200px;
    height: 320px;
    position: relative;
    transform-style: preserve-3d;
  }

  @media (max-width: 480px) {
    .sniper-loader {
      zoom: 0.44;
    }
  }

  .sniper-loader:before,
  .sniper-loader:after {
    --r: 20.5deg;
    content: "";
    width: 320px;
    height: 140px;
    position: absolute;
    right: 32%;
    bottom: -11px;
    background: #ffffff;
    transform: translateZ(200px) rotate(var(--r));
    animation: sniper-mask var(--duration) linear forwards infinite;
  }

  .sniper-loader:after {
    --r: -20.5deg;
    right: auto;
    left: 32%;
  }

  .sniper-loader .ground {
    position: absolute;
    left: -50px;
    bottom: -120px;
    transform-style: preserve-3d;
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }

  .sniper-loader .ground div {
    transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px) translateZ(100px) scale(0);
    width: 200px;
    height: 200px;
    background: var(--primary);
    background: linear-gradient(45deg, var(--primary) 0%, var(--primary) 50%, var(--primary-light) 50%, var(--primary-light) 100%);
    transform-style: preserve-3d;
    animation: sniper-ground var(--duration) linear forwards infinite;
  }

  .sniper-loader .ground div:before,
  .sniper-loader .ground div:after {
    --rx: 90deg;
    --ry: 0deg;
    --x: 44px;
    --y: 162px;
    --z: -50px;
    content: "";
    width: 156px;
    height: 300px;
    opacity: 0;
    background: linear-gradient(var(--primary), var(--primary-rgba));
    position: absolute;
    transform: rotateX(var(--rx)) rotateY(var(--ry)) translate(var(--x), var(--y)) translateZ(var(--z));
    animation: sniper-ground-shine var(--duration) linear forwards infinite;
  }

  .sniper-loader .ground div:after {
    --rx: 90deg;
    --ry: 90deg;
    --x: 0;
    --y: 177px;
    --z: 150px;
  }

  .sniper-loader .box {
    --x: 0;
    --y: 0;
    position: absolute;
    animation: var(--duration) linear forwards infinite;
    transform: translate(var(--x), var(--y));
  }

  .sniper-loader .box div {
    background-color: var(--primary);
    width: 48px;
    height: 48px;
    position: relative;
    transform-style: preserve-3d;
    animation: var(--duration) ease forwards infinite;
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }

  .sniper-loader .box div:before,
  .sniper-loader .box div:after {
    --rx: 90deg;
    --ry: 0deg;
    --z: 24px;
    --y: -24px;
    --x: 0;
    content: "";
    position: absolute;
    background-color: inherit;
    width: inherit;
    height: inherit;
    transform: rotateX(var(--rx)) rotateY(var(--ry)) translate(var(--x), var(--y)) translateZ(var(--z));
    filter: brightness(var(--b, 1.2));
  }

  .sniper-loader .box div:after {
    --rx: 0deg;
    --ry: 90deg;
    --x: 24px;
    --y: 0;
    --b: 1.4;
  }

  .sniper-loader .box.box0 { --x: -220px; --y: -120px; left: 58px;  top: 108px; animation-name: sniper-box-move0; }
  .sniper-loader .box.box0 div { animation-name: sniper-box-scale0; }
  .sniper-loader .box.box1 { --x: -260px; --y:  120px; left: 25px;  top: 120px; animation-name: sniper-box-move1; }
  .sniper-loader .box.box1 div { animation-name: sniper-box-scale1; }
  .sniper-loader .box.box2 { --x:  120px; --y: -190px; left: 58px;  top:  64px; animation-name: sniper-box-move2; }
  .sniper-loader .box.box2 div { animation-name: sniper-box-scale2; }
  .sniper-loader .box.box3 { --x:  280px; --y:  -40px; left: 91px;  top: 120px; animation-name: sniper-box-move3; }
  .sniper-loader .box.box3 div { animation-name: sniper-box-scale3; }
  .sniper-loader .box.box4 { --x:   60px; --y:  200px; left: 58px;  top: 132px; animation-name: sniper-box-move4; }
  .sniper-loader .box.box4 div { animation-name: sniper-box-scale4; }
  .sniper-loader .box.box5 { --x: -220px; --y: -120px; left: 25px;  top:  76px; animation-name: sniper-box-move5; }
  .sniper-loader .box.box5 div { animation-name: sniper-box-scale5; }
  .sniper-loader .box.box6 { --x: -260px; --y:  120px; left: 91px;  top:  76px; animation-name: sniper-box-move6; }
  .sniper-loader .box.box6 div { animation-name: sniper-box-scale6; }
  .sniper-loader .box.box7 { --x: -240px; --y:  200px; left: 58px;  top:  87px; animation-name: sniper-box-move7; }
  .sniper-loader .box.box7 div { animation-name: sniper-box-scale7; }

  @keyframes sniper-box-move0 {
    12%          { transform: translate(var(--x), var(--y)); }
    25%, 52%     { transform: translate(0, 0); }
    80%          { transform: translate(0, -32px); }
    90%, 100%    { transform: translate(0, 188px); }
  }
  @keyframes sniper-box-scale0 {
    6%           { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0); }
    14%, 100%    { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1); }
  }
  @keyframes sniper-box-move1 {
    16%          { transform: translate(var(--x), var(--y)); }
    29%, 52%     { transform: translate(0, 0); }
    80%          { transform: translate(0, -32px); }
    90%, 100%    { transform: translate(0, 188px); }
  }
  @keyframes sniper-box-scale1 {
    10%          { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0); }
    18%, 100%    { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1); }
  }
  @keyframes sniper-box-move2 {
    20%          { transform: translate(var(--x), var(--y)); }
    33%, 52%     { transform: translate(0, 0); }
    80%          { transform: translate(0, -32px); }
    90%, 100%    { transform: translate(0, 188px); }
  }
  @keyframes sniper-box-scale2 {
    14%          { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0); }
    22%, 100%    { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1); }
  }
  @keyframes sniper-box-move3 {
    24%          { transform: translate(var(--x), var(--y)); }
    37%, 52%     { transform: translate(0, 0); }
    80%          { transform: translate(0, -32px); }
    90%, 100%    { transform: translate(0, 188px); }
  }
  @keyframes sniper-box-scale3 {
    18%          { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0); }
    26%, 100%    { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1); }
  }
  @keyframes sniper-box-move4 {
    28%          { transform: translate(var(--x), var(--y)); }
    41%, 52%     { transform: translate(0, 0); }
    80%          { transform: translate(0, -32px); }
    90%, 100%    { transform: translate(0, 188px); }
  }
  @keyframes sniper-box-scale4 {
    22%          { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0); }
    30%, 100%    { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1); }
  }
  @keyframes sniper-box-move5 {
    32%          { transform: translate(var(--x), var(--y)); }
    45%, 52%     { transform: translate(0, 0); }
    80%          { transform: translate(0, -32px); }
    90%, 100%    { transform: translate(0, 188px); }
  }
  @keyframes sniper-box-scale5 {
    26%          { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0); }
    34%, 100%    { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1); }
  }
  @keyframes sniper-box-move6 {
    36%          { transform: translate(var(--x), var(--y)); }
    49%, 52%     { transform: translate(0, 0); }
    80%          { transform: translate(0, -32px); }
    90%, 100%    { transform: translate(0, 188px); }
  }
  @keyframes sniper-box-scale6 {
    30%          { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0); }
    38%, 100%    { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1); }
  }
  @keyframes sniper-box-move7 {
    40%          { transform: translate(var(--x), var(--y)); }
    53%, 52%     { transform: translate(0, 0); }
    80%          { transform: translate(0, -32px); }
    90%, 100%    { transform: translate(0, 188px); }
  }
  @keyframes sniper-box-scale7 {
    34%          { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0); }
    42%, 100%    { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1); }
  }

  @keyframes sniper-ground {
    0%, 65%      { transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px) translateZ(100px) scale(0); }
    75%, 90%     { transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px) translateZ(100px) scale(1); }
    100%         { transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px) translateZ(100px) scale(0); }
  }
  @keyframes sniper-ground-shine {
    0%, 70%      { opacity: 0; }
    75%, 87%     { opacity: 0.2; }
    100%         { opacity: 0; }
  }
  @keyframes sniper-mask {
    0%, 65%      { opacity: 0; }
    66%, 100%    { opacity: 1; }
  }
`;

const Preloader = ({ onComplete }: PreloaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({ paused: true });

    // Logo fades + scales in
    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.82, y: 12 },
      { opacity: 1, scale: 1, y: 0, duration: 0.75, ease: "back.out(1.7)" }
    );

    // Hold for the full animation cycle (3s), then slide out
    tl.to(containerRef.current, {
      yPercent: -105,
      duration: 0.9,
      ease: "power3.inOut",
      delay: 3.2,
      onComplete: () => {
        if (doneRef.current) return;
        doneRef.current = true;
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        onComplete();
      },
    });

    tl.play();

    return () => {
      if (!doneRef.current) {
        tl.kill();
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const boxes = [...Array(8).keys()];

  return (
    <>
      <style>{loaderCss}</style>
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          willChange: "transform",
        }}
      >
        {/* Sniper logo */}
        <img
          ref={logoRef}
          src={imgSrc}
          alt="Sniper Systems"
          style={{
            height: "54px",
            width: "auto",
            objectFit: "contain",
            opacity: 0,
            marginBottom: "64px",
          }}
        />

        {/* 3-D box stack animation */}
        <div className="sniper-loader">
          {boxes.map(i => (
            <div key={i} className={`box box${i}`}>
              <div />
            </div>
          ))}
          <div className="ground">
            <div />
          </div>
        </div>
      </div>
    </>
  );
};

export default Preloader;
