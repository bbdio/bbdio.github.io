
let charVar = String.fromCharCode(127);
function embed(text, secret, password){

    if(text.length==0){
        text = '     '
    }
    //获取字节数组
    let bytes = []

    // let charVar = String.fromCharCode(127);
    let one = "1";
    let result = ""
    let bb = writeUTF(secret,true)
    bb.forEach(b=>{
        // console.log(b & 0xFF)
        let cs = b.toString(2).padStart(8, '0')
        one += cs;
        // console.log(cs)
    })
    one = one + "1"
    let srcText = text
    while(srcText.length < one.length){
        srcText += text
    }
    for (let i = 0; i < srcText.length; i++) {
        result += srcText[i]
        if(i < one.length){
            if(one[i] == "1"){
                result += charVar
            }
        }
    }

    return result
}

function extract(text, password){
    let secret = ""
    let ext = ""
    // let charVar = String.fromCharCode(127);
    let ii = 0
    while(ii < text.length){
        if (text[ii] == charVar){
            ii += 2;
            ext += "1"
        }else{
            ii += 1;
            ext += "0"
        }
    }
    let first1 = 0
    let last1 = 0
// ext = "10010"
    for (let i = 0; i < ext.length; i++) {
        if(ext[i] == "1"){
            first1 = i;
            break
        }
    }

    let reExt = ext.split("").reverse().join("");
    for (let i = 0; i < reExt.length; i++) {
        if(reExt[i] == "1"){
            last1 = reExt.length - i - 1
            break
        }
    }
    ext = ext.substring(first1 + 1,last1)

    let bt = []
    for (let i = 0; i < ext.length/8; i++) {
        let c = ext.substring(i*8,(i*8)+8)
        let ic = parseInt(c,2)
        bt.push(ic)
    }
    console.log(bt)
    let utfByte = new Uint8Array(bt)
    let decoder = new TextDecoder("utf-8")
    let utfStr = decoder.decode(utfByte)
    console.log("utfStr:", utfStr)
    return utfStr
}

function writeUTF(str, isGetBytes=true) {
    var back = [];
    var byteSize = 0;
    for (var i = 0; i < str.length; i++) {
        var code = str.codePointAt(i);
        if (0x00 <= code && code <= 0x7f) {
            byteSize += 1;
            back.push(code);
        } else if (0x80 <= code && code <= 0x7ff) {
            byteSize += 2;
            back.push((192 | (31 & (code >> 6))));
            back.push((128 | (63 & code)))
        } else if ((0x800 <= code && code <= 0xd7ff)
            || (0xe000 <= code && code <= 0xffff)) {
            byteSize += 3;
            back.push((224 | (15 & (code >> 12))));
            back.push((128 | (63 & (code >> 6))));
            back.push((128 | (63 & code)))
        }else if((0x10000 <= code && code <= 0x10ffff)){
            byteSize+=4;
            back.push((240 |(7 & (code>>18))));
            back.push((128 |(63 & (code>>12))));
            back.push((128 |(63 & (code>>6))));
            back.push((128 |(63 & (code))));
        }
    }
    for (i = 0; i < back.length; i++) {
        back[i] &= 0xff;
    }
    if (isGetBytes) {
        return back
    }
    if (byteSize <= 0xff) {
        return [0, byteSize].concat(back);
    } else {
        return [byteSize >> 8, byteSize & 0xff].concat(back);
    }
}

function copyToClipboard(text) {
    var textarea = document.createElement('textarea');
    textarea.style.position = 'fixed';
    textarea.style.opacity = 0;
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}
