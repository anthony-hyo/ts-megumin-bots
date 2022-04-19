import * as fs from "fs"

export default class Helper {

    public static getAllFilesFromFolder(dir: string): string[] {
        let results: string[] = []

        fs.readdirSync(dir).forEach((file: string) => {
            file = dir + '/' + file

            let stat = fs.statSync(file)

            if (stat && stat.isDirectory()) {
                results = results.concat(Helper.getAllFilesFromFolder(file))
            } else {
                results.push(file)
            }

        })

        return results;
    }

    public static async asyncForEach(array: Array<any>, callback: Function): Promise<void> {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

    public static randomIntegerInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    public static arrayAverage(arr: Array<number>): number {
        //Find the sum
        let sum = 0;

        for (const i in arr) {
            sum += arr[i];
        }
        //Get the length of the array
        const numbersCnt = arr.length;

        //Return the average / mean.
        return sum / numbersCnt
    }

    public static parseHTML = (value: string) => value.replaceAll(/<.*?>/, '');

}
