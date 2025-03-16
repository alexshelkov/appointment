const createSlots = (startTime: number, endTime: number, duration: number) => {
  const slots: Array<[Date, Date]> = [];

  while (startTime < endTime) {
    slots.push([new Date(startTime), new Date(startTime + duration)]);

    startTime += duration;
  }

  return slots;
};

export const createRepeatSlots = (
  startTime: Date,
  endTime: Date,
  duration: number,
  repeat?: string
) => {
  const lastDayOfMonth = new Date(
    endTime.getFullYear(),
    endTime.getMonth() + 1,
    0
  ).getDate();
  let slots: Array<[Date, Date]> = [];

  if (repeat === 'day' || repeat == 'week') {
    const dayOfWeek = endTime.getDay();
    let currentDay = endTime.getDate();

    while (currentDay <= lastDayOfMonth) {
      if (
        repeat === 'day' ||
        (repeat == 'week' && dayOfWeek === endTime.getDay())
      ) {
        slots = slots.concat(
          createSlots(startTime.getTime(), endTime.getTime(), duration)
        );
      }

      currentDay += 1;
      startTime.setDate(currentDay);
      endTime.setDate(currentDay);
    }
  } else {
    slots = createSlots(startTime.getTime(), endTime.getTime(), duration);
  }

  return slots;
};
