<template>
  <div class="loader">
    <div class="ml-loader">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<style scoped>
.loader {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: rgba(21, 54, 54, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.ml-loader {
  position: relative;
  transform: translateY(-50%);
  width: 150px;
  height: 150px;
  margin: 0 auto;
}
.ml-loader div {
  transform-origin: 100px 100px;
  animation: 1.2s loader ease-in-out infinite both;
}
.ml-loader div::after {
  content: '';
  display: block;
  position: absolute;
  top: 180px;
  left: 89px;
  width: 16px;
  height: 50px;
  border-radius: 10px;
  background-color: var(--tiffany-50);
}
.ml-loader div:nth-child(1) {
  transform: rotate(0);
}
.ml-loader div:nth-child(2) {
  transform: rotate(30deg);
  animation-delay: 0.1s;
}
.ml-loader div:nth-child(3) {
  transform: rotate(60deg);
  animation-delay: 0.2s;
}
.ml-loader div:nth-child(4) {
  transform: rotate(90deg);
  animation-delay: 0.3s;
}
.ml-loader div:nth-child(5) {
  transform: rotate(120deg);
  animation-delay: 0.4s;
}
.ml-loader div:nth-child(6) {
  transform: rotate(150deg);
  animation-delay: 0.5s;
}
.ml-loader div:nth-child(7) {
  transform: rotate(180deg);
  animation-delay: 0.6s;
}
.ml-loader div:nth-child(8) {
  transform: rotate(210deg);
  animation-delay: 0.7s;
}
.ml-loader div:nth-child(9) {
  transform: rotate(240deg);
  animation-delay: 0.8s;
}
.ml-loader div:nth-child(10) {
  transform: rotate(270deg);
  animation-delay: 0.9s;
}
.ml-loader div:nth-child(11) {
  transform: rotate(300deg);
  animation-delay: 1s;
}
.ml-loader div:nth-child(12) {
  transform: rotate(330deg);
  animation-delay: 1.1s;
}
.ml-loader div:nth-child(13) {
  transform: rotate(360deg);
  animation-delay: 1.2s;
}
@keyframes loader {
  0% {
    opacity: 0.1;
  }
  40% {
    opacity: 1;
  }
  80% {
    opacity: 0.1;
  }
  100% {
    opacity: 0.1;
  }
}
</style>
