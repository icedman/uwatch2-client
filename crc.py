def _hex(h,n):
    return "{0:0{1}x}".format(h,n)

def crc(bytes):
    result = 65258
    for b in bytes:
        b2 = (((result & 0xff) << 8) | ((0xFF00 & result) >> 8)) ^ (b & 0xff)
        b3 = b2 ^ ((b2 & 0xff) >> 4)
        b4 = b3 ^ (((b3 & 0xff) << 8) << 4)
        result = b4 ^ (((b4 & 0xff) << 4) << 1)

    return _hex(result & 0xffff, 4)

def dump(bytes, l):
    str = 'fe ';
    str = str + crc(bytes);
    str += ' ';
    str += _hex(l & 0xff, 2);
    for c in bytes:
        str += ' ' + _hex(c, 2)
    return str

def read_file(f):
    lines = []
    cleaned = []
    bytes = []
    l = 0
    size = 0
    idx = 0;
    with open("./source/432.bin", "rb") as f:
        l = f.read(None)
        for c in l:
            bytes.append(c)
            idx += 1
            if idx > 255:
                lines.append(dump(bytes, idx))
                bytes = []
                size += idx
                idx = 0
        if (idx > 0):
            lines.append(dump(bytes, idx))
            bytes = []
            size += idx
            idx = 0

    res = ""
    for l in lines:
        res += l + " \n"
    print(res)
    # print(_hex(size,4))
    return [ _hex(size,6), lines ]
    
# read_file('./source/432.bin')
read_file('./source/1472.bin')