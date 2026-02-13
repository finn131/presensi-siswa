from datetime import datetime, date, time
from config import Config


def get_attendance_status(current_time=None):
    """
    Determine attendance status based on time.
    Returns 'Hadir' if on time, 'Terlambat' if late.
    """
    if current_time is None:
        current_time = datetime.now().time()
    
    cutoff_hour, cutoff_minute = Config.RFID_CUTOFF_TIME
    cutoff_time = time(cutoff_hour, cutoff_minute)
    
    # Rule: sebelum cutoff = Hadir, jam cutoff dan setelahnya = Terlambat
    return 'Hadir' if current_time < cutoff_time else 'Terlambat'


def format_datetime(dt):
    """Format datetime to readable string"""
    if not dt:
        return None
    return dt.strftime('%Y-%m-%d %H:%M:%S')


def format_date(d):
    """Format date to readable string"""
    if not d:
        return None
    return d.strftime('%Y-%m-%d')
