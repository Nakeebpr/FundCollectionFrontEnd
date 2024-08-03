

export const getNames = (data) => {
    try {
        let names = data.split(" ");
        return names
    } catch {
        console.log("Name is incorrect")
    }
}