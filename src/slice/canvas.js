// 2D context. By default the browser draws on the CPU (willReadFrequently), the mode measured at 60 frames
// per second while playing time and dragging the map. With ?gpu in the URL, it uses the GPU-accelerated canvas.
const gpu = new URLSearchParams(location.search).has('gpu');
export const ctx2d = cv => cv.getContext('2d', gpu ? undefined : { willReadFrequently: true });
