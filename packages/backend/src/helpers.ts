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
    endTime.getUTCFullYear(),
    endTime.getUTCMonth() + 1,
    0
  ).getDate();
  let slots: Array<[Date, Date]> = [];

  if (repeat === 'day' || repeat == 'week') {
    const dayOfWeek = endTime.getUTCDate();
    let currentDay = endTime.getUTCDate();

    while (currentDay <= lastDayOfMonth) {
      if (
        repeat === 'day' ||
        (repeat == 'week' && dayOfWeek === endTime.getUTCDay())
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
