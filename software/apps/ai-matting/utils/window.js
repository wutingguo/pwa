export const sendMessageToWindow = (message, targetOrigin, targetWindow) => {
  targetWindow = targetWindow || window.parent;
  targetOrigin = targetOrigin || '*';
  targetWindow.postMessage(message, targetOrigin);
};
