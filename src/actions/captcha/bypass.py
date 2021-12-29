from hcapbypass import bypass
import sys
# os.system('python3 -m pip install httpx'.format(sys.argv[1]))

captcha_solved = bypass(sys.argv[1], 'mercadolibre.com', True)
print(captcha_solved)
