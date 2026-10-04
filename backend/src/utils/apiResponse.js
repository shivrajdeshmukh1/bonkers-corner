export const ok = (res, data, message = 'OK') =>
  res.json({ success: true, data, message });
export const created = (res, data, message = 'Created') =>
  res.status(201).json({ success: true, data, message });
