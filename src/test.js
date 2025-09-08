function isMacOS() {
  if (navigator.userAgentData && navigator.userAgentData.platform) {
    return navigator.userAgentData.platform === 'macOS';
  }
  if (navigator.platform && navigator.platform.toLowerCase().includes('mac')) {
    return true;
  }
  return /mac/i.test(navigator.userAgent);
}


console.log(isMacOS());