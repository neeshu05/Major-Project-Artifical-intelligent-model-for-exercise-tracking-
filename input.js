#!/usr/bin/env node
let inputArr = process.argv.slice(2)
//console.log(inputArr)
const fs = require('fs')
const path = require('path')
let command = inputArr[0];
let types = {
    media: ['mp4','mkv'],
    archives:['zip','7z','rar','tar','gz','ar','iso','xz'],
    documents:['docx','doc','pdf','xlsx','txt','svg'],
    images:['img','jpeg','jpg'],
    app:['exe','dmg'],
    html:['html']
}
switch(command){
    case "tree":
        treeFn(inputArr[1])
        break;
    case "organize":
        organizeFn(inputArr[1])
        break
    case "help":
        helpFn()
        break
    default:
        console.log("please type correct command")
        break
}
function treeFn(dirPath){
    if(dirPath == undefined){
        treeHelper(process.cwd(),' ')
    }
    else{
        treeHelper(dirPath,' ')
    }
}

function treeHelper(dirPath,indent){
    let isFile = fs.lstatSync(dirPath).isFile();
    if(isFile){
        let fileName = path.basename(dirPath);
        console.log(indent + '|--' + fileName)
    }
    else{
        let dirName = path.basename(dirPath)
        console.log(indent + "|---" + dirName)
        let childnames = fs.readdirSync(dirPath)
        for(let i = 0;i<childnames.length;i++){
            let childPath = path.join(dirPath,childnames[i])
            treeHelper(childPath,indent)
        }
    }
}



function organizeFn(dirPath){
    let destPath;
    if(dirPath == undefined){
        destPath = process.cwd();
        return;
    }
    else{
        let doesExist = fs.existsSync(dirPath)
        if(doesExist){
            destPath = path.join(dirPath,"organized_files")
            if(fs.existsSync(destPath) == false){
                fs.mkdirSync(destPath)
            }
        }
        else{
            console.log('kindly enter the correct path')
            return;
        }
    }
    organizeHelper(dirPath,destPath)
}

function organizeHelper(src,dest){
    let childnames = fs.readdirSync(src)
    //console.log(childnames)
    for(let i = 0;i<childnames.length;i++){
        let childAddress = path.join(src,childnames[i])
        //console.log(childAddress)
        let isFile = fs.lstatSync(childAddress).isFile();
        if(isFile){
            let getCat = getCategory(childnames[i])
            //console.log(getCat)
            sendFiles(childAddress,dest,getCat)
        }
    }
}

function sendFiles(src,dest,category){
    let categoryPath = path.join(dest,category)
    if(fs.existsSync(categoryPath) == false){
        fs.mkdirSync(categoryPath)
    }
    let pathA = path.basename(src)
    let fileName = path.join(categoryPath,pathA)
    //console.log(fileName)
    fs.copyFileSync(src,fileName)
    fs.unlinkSync(src)
    console.log('file is organized ' + fileName)
}

function getCategory(src){
    let ext = path.extname(src)
    ext = ext.slice(1);
    for(let type in types){
        let cTypes = types[type]
        for(let i = 0;i<cTypes.length;i++){
            if(ext == cTypes[i]){
                return type;
            }
        }
    }
    return "others"
}

function helpFn(dirPath){
    console.log(`help directories are:
    tree
    organize
    help
    `)
} 