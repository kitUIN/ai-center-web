export function toNow(givenTimeString?: string | null, omit?: boolean) {
  if (givenTimeString === undefined || givenTimeString === null) {
    return "";
  }
  const givenDate = new Date(givenTimeString);
  const currentDate = new Date();
  const timeDiff = currentDate.getTime() - givenDate.getTime();
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (omit === true) {
    if (days > 0) {
      return `${days} 天`;
    } else if (hours > 0) {
      return `${hours} 小时`;
    } else if (minutes > 0) {
      return `${minutes} 分钟`;
    } else {
      return `${seconds} 秒`;
    }
  } else {
    if (days > 0) {
      return `${days} 天 ${hours % 24} 小时 ${minutes % 60} 分钟 ${
        seconds % 60
      } 秒`;
    } else if (hours > 0) {
      return `${hours} 小时 ${minutes % 60} 分钟 ${seconds % 60} 秒`;
    } else if (minutes > 0) {
      return `${minutes} 分钟 ${seconds % 60} 秒`;
    } else {
      return `${seconds} 秒`;
    }
  }
}
export function secondsToString(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}
