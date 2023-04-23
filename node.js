let gethue = h => {
    h = h%360
    let part = Math.floor(h / 60)
    let is_start_part = part % 2 == 0
    let result = {r:0,g:0,b:0}

    if(is_start_part) { 
        let l = [{key:"r",value:120 * 0},{key:"g",value:120 * 1},{key:"b",value:120 * 2}][(part / 2) % 3]
        let s = [{key:"r",value:120 * 0},{key:"g",value:120 * 1},{key:"b",value:120 * 2}][(part / 2 + 1) % 3]
        result[l.key] = 255
        result[s.key] = (h - l.value) / 60 * 255
    } else { 
        let l = [{key:"r",value:120 * 0},{key:"g",value:120 * 1},{key:"b",value:120 * 2}][((part - 1) / 2) % 3]
        let s = [{key:"r",value:120 * 0},{key:"g",value:120 * 1},{key:"b",value:120 * 2}][((part - 1) / 2 + 1) % 3]
        result[l.key] = 255 - ((h - l.value - 60) / 60 * 255)
        result[s.key] = 255
    }

return result
}

function hsl_rgb(h,s,l,a,options = {use_alpha:true,add_alpha:false,return_color:true,return_values:true,Values_Type:"array",use_comma:true,hwb_special_uncomma:false}) {

let addLigtenlightness = (l,rgb) => {

Object.entries(rgb).forEach(entry => { 
let key = entry[0], value = entry[1]
let result = ((l-50)/50 * (l > 50 ? 255 - value : value) + value) 
rgb[key] = result < 0 ? 0 : result > 255 ? 255 : result
})

return rgb
}

let addsaturation = (s,l,rgb) => { 
let GrayScale = 255 * (l / 100) 

Object.entries(rgb).forEach(entry => { 
let key = entry[0], value = entry[1]
let result = value + ((GrayScale - value) * (100 - s)/100)
rgb[key] = result < 0 ? 0 : result > 255 ? 255 : result
})

return rgb
}


    return  details(
    `rgb(${Object.values(addsaturation(s,l,addLigtenlightness(l,gethue(h)))).map(x=>Math.round(x)).join(',')}${a?`,${a}`:''})`,
    options
    )
}

function rgb_hsl(r,g,b,a,options = {use_alpha:true,add_alpha:false,return_color:true,return_values:true,Values_Type:"array",use_comma:true,hwb_special_uncomma:false}) {
    let sort = _ => { 
        let sorted = [{value:r,place:0}]
        let rgb = [g,b]
        rgb.forEach((color,index)=>{

            sorted.forEach((sortedcolor,sortedindex)=>{
                let save = sortedcolor

                if(color < sortedcolor["value"]) {
                    sorted[sortedindex] = {value:color,place:index + 1}
                    sorted.push(save)
                }

                else if(sortedindex == sorted.length - 1) { 
                    sorted.push({value:color,place:index + 1})
                }

            })


        })

        return sorted.reverse()
    }

// h = (mid - min) / (borderBottom - borderTop) * 60 + (60 * part[0-6])
let 
[max,mid,min] = sort()
part = ((min.place + 1) % 3 * 2) + (max.place == min.place + 2 % 3 ? 1 : 0),
hue = (part * 60) + (mid["value"] - min["value"]) / (max["value"] - min["value"]) * 60 

// lightness = difference borders / 255  * 50 
let 
min_lightness = min["value"] / 255 * 50,
max_lightness = (max["value"] - 255) / 255 * 50,
lightness =  50 + min_lightness + max_lightness

// saturation = rate min from GrayScale : (lightness from 255)
let 
borderbottom = (lightness - 50) / 50 * 255 > 0 ? (lightness - 50) / 50 * 255 : 0,
GrayScale =  lightness / 100 * 255 ,
saturation = 100 - (min["value"] - borderbottom) / (GrayScale - borderbottom) * 100  

return details(`hsl(${isNaN(hue) ? 0 : Math.round(hue)},${isNaN(saturation) ? 0 :Math.round(saturation)}%,${Math.round(lightness)}%${a?`,${a}`:''})`,options)

}

function hwb_rgb(h,w,b,a,options = {use_alpha:true,add_alpha:false,return_color:true,return_values:true,Values_Type:"array",use_comma:true,hwb_special_uncomma:false}) { 

// way 2 to handle + 100 b+w if(b + w >= 100) {w >= b ? b = 100 - w : w = 100 - b}
if(b + w > 100) {
if(w > b){w =  100 / (w / b) ; b = 100 - w }
else {b =  100 / (b / w) ; w = 100 - b }
}

    let add_Whitenees_Darkness = (w,b,rgb) => { 

        Object.entries(rgb).forEach(entry => { 
        let key = entry[0], value = entry[1]
        let whitevalue = (255 - value) * w/100
        let blackvalue = value * b/100
        let result = value + whitevalue - blackvalue
        rgb[key] = result < 0 ? 0 : result > 255 ? 255 : result
        })

    return rgb

    }

    return  details(
    `rgb(${Object.values(add_Whitenees_Darkness(w,b,gethue(h))).map(x=>Math.round(x)).join(',')}${a?`,${a}`:''})`,
    options
    )


}

function rgb_hwb(r,g,b,a,options = {use_alpha:true,add_alpha:false,return_color:true,return_values:true,Values_Type:"array",use_comma:true,hwb_special_uncomma:false}) {

    let sort = _ => { 
        let sorted = [{value:r,place:0}]
        let rgb = [g,b]
        rgb.forEach((color,index)=>{

            sorted.forEach((sortedcolor,sortedindex)=>{
                let save = sortedcolor

                if(color < sortedcolor["value"]) {
                    sorted[sortedindex] = {value:color,place:index + 1}
                    sorted.push(save)
                }

                else if(sortedindex == sorted.length - 1) { 
                    sorted.push({value:color,place:index + 1})
                }

            })


        })

        return sorted.reverse()
    }

// h = (mid - min) / (borderBottom - borderTop) * 60 + (60 * part[0-6])
let 
[max,mid,min] = sort(),
part = ((min.place + 1) % 3 * 2) + (max.place == min.place + 2 % 3 ? 1 : 0),
hue = (part * 60) + (mid["value"] - min["value"]) / (max["value"] - min["value"]) * 60 ,
whiteness = (min["value"]) / 255 * 100,
blackness = (255 - max["value"]) / 255 * 100
return details(`hwb(${isNaN(hue) ? 0 : Math.round(hue)},${Math.round(whiteness)}%,${Math.round(blackness)}%${a?`,${a}`:''})`,options)
}

function hex_rgb(h,e,x,a,options = {use_alpha:true,add_alpha:false,return_color:true,return_values:true,Values_Type:"array",use_comma:true,hwb_special_uncomma:false}) {

    let convert = letter => { 
        if(letter.length == 1) {
            if(isNaN(+letter)){letter = "abcdef".search(letter) + 10}else{letter=+letter}
            return letter * 17
        } else {
            let letters = []    
            Array.from(letter).forEach(letter => {if(isNaN(+letter)){letters.push("abcdef".search(letter) + 10)}else{letters.push(+letter)}})
            return letters[0] * 16 + letters[1]
        }
    }


    return details(`rgb(${convert(h)},${convert(e)},${convert(x)}${a ? `,${convert(a)/255}` : ``})`,options)
}

function rgb_hex(r,g,b,a,options = {hex_length:2,use_alpha:true,add_alpha:false,return_color:true,return_values:true,Values_Type:"array",use_comma:true,hwb_special_uncomma:false}) {
    let Defult_options = {hex_length:2}
    Object.entries(Defult_options).forEach(entry=>{
        let OptionKey = entry[0] , OptionVlaue = entry[1]
        if(options[OptionKey] == undefined){
            options[OptionKey] = OptionVlaue
        }
    })

    let convert = number => { 
        if(options.hex_length == 1) {
            number = Math.round(number / 17) < 10 ? Math.round(number / 17)+'' : [..."abcdef"][Math.round(number / 17) - 10]
            return number + ''
        } else {
            let num1 = Math.trunc(number/16) * 16 , num2 = number - num1
            num1 = Math.round(num1/16) < 10 ? Math.round(num1/16) : [..."abcdef"][Math.round(num1/16) - 10]
            num2 = num2 < 10 ? num2 : [..."abcdef"][num2 - 10]
            return `${num1}${num2}`
        }
    }

return details(`#${convert(r)}${convert(g)}${convert(b)}${a ? convert(a*255) : ""}`,options)
}

function hex_hsl(h,e,x,a,options = {}) { 
let rgb = hex_rgb(h,e,x,a,{return_color:false}).map(e=>+e)
rgb.length = 4
return rgb_hsl(...rgb,options)
}
function hsl_hex(h,s,l,a,options = {}) { 
let rgb = hsl_rgb(h,s,l,a,{return_color:false}).map(e=>+e)
rgb.length = 4
return rgb_hex(...rgb,options)
}
function hsl_hwb(h,s,l,a,options = {}) { 
let rgb = hsl_rgb(h,s,l,a,{return_color:false}).map(e=>+e)
rgb.length = 4
return rgb_hwb(...rgb,options)
}
function hwb_hsl(h,w,b,a,options = {}) { 
let rgb = hwb_rgb(h,w,b,a,{return_color:false}).map(e=>+e)
rgb.length = 4
return rgb_hsl(...rgb,options)
}
function hex_hwb(h,e,x,a,options = {}) { 
let rgb = hex_rgb(h,e,x,a,{return_color:false}).map(e=>+e)
rgb.length = 4
return rgb_hwb(...rgb,options)
}
function hwb_hex(h,w,b,a,options = {}) { 
let rgb = hwb_rgb(h,w,b,a,{return_color:false}).map(e=>+e)
rgb.length = 4
return rgb_hex(...rgb,options)
}
function GetType(Color,func = Type => Type,error = Error => console.log(Error)) { 
    let matchs = {
        rgb:/(rgb)a?\(\d{0,3}(,|\s)+\d{0,3}(,|\s)+\d{0,3}((,|((\s)*\/(\s)*))\d?\.{0,1}\d+)?\)/,
        hsl:/(hsl)a?\(\d{0,3}(,|\s)+\d{0,3}%(,|\s)+\d{0,3}%((,|((\s)*\/(\s)*))\d?\.{0,1}\d+)?\)/,
        hwb:/(hwb)\(\d{0,3}(,|\s)+\d{0,3}%(,|\s)+\d{0,3}%((,|((\s)*\/(\s)*))\d?\.{0,1}\d+)?\)/,
        hex:/#(\w{8}|\w{6}|\w{4}|\w{3})/
    }

    let Color_Match = false
    let Result


    Object.entries(matchs).forEach(entry=>{
        let key = entry[0],reg = entry[1]
        if(reg.test(Color)){
            Result = func(key)
            Color_Match = true
        }
    })
    if(Color_Match){return Result} else {error("Color did not Match")}

}
function details(Color,options = {use_alpha:true,add_alpha:false,return_color:true,return_values:true,Values_Type:"array",use_comma:true,hwb_special_uncomma:false} ) {

    let Defult_options = {use_alpha:true,add_alpha:false,return_color:true,return_values:true,Values_Type:"array",use_comma:true,hwb_special_uncomma:false}

    Object.entries(Defult_options).forEach(entry=>{
        let OptionKey = entry[0] , OptionVlaue = entry[1]
        if(options[OptionKey] == undefined){
            options[OptionKey] = OptionVlaue
        }
    })

return Read(Color,GetType(Color))


    function Read(Color,Type) { 
        if(Type == 'hex') {return Read_hex(Color)}
        let values = Color.match(/(\d|\.|%)+/ig)
        let is_alpha = values.length >= 4 || false
        let Return_Values = options["Values_Type"] == "object" ? {} : []
        let Return_ValuesArr = []
        let ColorPatern = [...Type].concat("a")

        values.forEach((value,index)=>{
            if(!Array.isArray(Return_Values)) {
                Return_Values[ColorPatern[index]] = value.match(/(\d|\.)/ig).join('')
            } else {
                Return_Values.push(value.match(/(\d|\.)/ig).join(''))
            }
            Return_ValuesArr.push(value)
        })

        if(options["add_alpha"] && !is_alpha){
            if(!Array.isArray(Return_Values)) {
                Return_Values['a'] = '1'
            } else {
                Return_Values.push('1')
            }
                Return_ValuesArr.push('1')
        }

        if((options["hwb_special_uncomma"] && Type == "hwb") || !options["use_comma"]){
            Color = `${Type}(${Return_ValuesArr[0]} ${Return_ValuesArr[1]} ${Return_ValuesArr[2]}${Return_ValuesArr[3] ? ` / ${Return_ValuesArr[3]}` : ''})`
        }else{
            Color = `${Type}(${Return_ValuesArr.join(',')})`
        }



        if(options["return_values"] && options["return_color"]) { 
            return {color:Color,values:Return_Values}
        } else if (options["return_color"]) {
            return Color
        } else if (options["return_values"]) { 
            return Return_Values
        } else { 
            return `options close any return`
        }

    }

    function Read_hex(Color) { 
        let values = Color.match(new RegExp(`[^#]{${Color.match(/\w/ig).length == 6 || Color.match(/\w/ig).length == 8 ? 2 : 1}}`,"ig"))
        let is_alpha = values.length >= 4 || false
        let Return_Values = options["Values_Type"] == "object" ? {} : []
        let ColorPatern = ['r','g','b','a']

        values.forEach((value,index)=>{
            if(!Array.isArray(Return_Values)) {
                Return_Values[ColorPatern[index]] = value
            } else {
                Return_Values.push(value)
            }
        })

        if(options["add_alpha"] && !is_alpha){
            if(!Array.isArray(Return_Values)) {
                Return_Values['a'] = Color.match(/(\w)/ig).length == 6 || Color.match(/(\w)/ig).length == 8 ? 'ff' : 'f'
            } else {
                Return_Values.push(Color.match(/(\w)/ig).length == 6 || Color.match(/(\w)/ig).length == 8 ? 'ff' : 'f')
            }
            Color += Color.match(/(\w)/ig).length == 6 || Color.match(/(\w)/ig).length == 8 ? 'ff' : 'f'
        }
        if(options["return_values"] && options["return_color"]) { 
            return {color:Color,values:Return_Values}
        } else if (options["return_color"]) {
            return Color
        } else if (options["return_values"]) { 
            return Return_Values
        } else { 
            return `options close any return`
        }

    }   

}
function Convert(Color,To,options = {use_alpha:true,add_alpha:false,return_color:true,return_values:true,Values_Type:"array",use_comma:true,hwb_special_uncomma:false}) { 
    let Type = GetType(Color)
    if(Type == To) { 
        return details(Color,options)
    } else {
        let values = details(Color,{return_color:false})
        values.length = 3 ? values.push('') : ""
        return eval(`${Type}_${To}(${values.map(x=>`'${x}'`)},options)`)
    }

}

let 
rgb = (Color,options = {use_alpha:true,add_alpha:false,return_color:true,return_values:true,Values_Type:"array",use_comma:true,hwb_special_uncomma:false}) => Convert(Color,"rgb",options), 
hsl = (Color,options = {use_alpha:true,add_alpha:false,return_color:true,return_values:true,Values_Type:"array",use_comma:true,hwb_special_uncomma:false}) => Convert(Color,"hsl",options), 
hwb = (Color,options = {use_alpha:true,add_alpha:false,return_color:true,return_values:true,Values_Type:"array",use_comma:true,hwb_special_uncomma:false}) => Convert(Color,"hwb",options), 
hex = (Color,options = {hex_length:2,use_alpha:true,add_alpha:false,return_color:true,return_values:true,Values_Type:"array",use_comma:true,hwb_special_uncomma:false}) => Convert(Color,"hex",options) 


module.exports = {rgb,hsl,hwb,hex}







