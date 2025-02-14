const trackingEvent = (event: string, params: Record<string, unknown>) => {
  if (window.gtag) {
    window.gtag("event", event, params);
  }
};

export default trackingEvent;
