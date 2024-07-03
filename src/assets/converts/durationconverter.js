function formatDuration(minutes) {
    if (typeof minutes !== 'number' || minutes < 0) {
      return 'Invalid input';
    }
  
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
  
    let durationString = '';
  
    if (hours > 0) {
      durationString += hours === 1 ? '1 hour' : `${hours} hours`;
      if (remainingMinutes > 0) {
        durationString += ' and ';
      }
    }
  
    if (remainingMinutes > 0) {
      durationString += remainingMinutes === 1 ? '1 minute' : `${remainingMinutes} minutes`;
    }
  
    return durationString;
  }

export default  formatDuration