const fs = require('node:fs/promises');
const path = require('node:path')

const foo = async () => {
    const basePath = path.join(process.cwd(), 'main-folder')
    await fs.mkdir(basePath, {recursive: true})

    const DirArr = ['dir1', 'dir2', 'dir3', 'dir4', 'dir5'];
    const FileArr = ['file1', 'file2', 'file3', 'file4', 'file5'];

    await Promise.allSettled([
        ...DirArr.map(async (folder) => {
            const folderPath = path.join(basePath, dir)
            await fs.mkdir(folderPath, {recursive: true})
        }),
        ...FileArr.map(async (file) => {
            const filePath = path.join(basePath, `${file}.txt`)
            await fs.writeFile(filePath, 'pis')
        }),
    ])


    const filesNames = await fs.readdir(basePath);
    for (const filesName of filesNames) {
        const stat = await fs.stat(path.join(basePath, filesName));
        console.log(filesName, stat.isDirectory())
    }
}
void foo();

