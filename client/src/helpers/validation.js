export function isFileTooBig(file) {
            const size = file.size / 1024 / 1024
            return size > 10
}

export function isFileCorrectType(file) {
    return !['image/jpg', 'image/jpeg', 'image/png'].includes(file.type)

}