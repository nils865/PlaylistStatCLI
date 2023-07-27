import inquirer from 'inquirer'

export type StatType = "User" | "Playlist"

export async function select_stats(): Promise<StatType> {
    const answers = await inquirer.prompt({
        name: "scope",
        type: "list",
        message: "Select your Scope",
        choices: [
            'Playlist',
            'User'
        ]
    })

    return answers.scope
}

export async function get_id(scope: StatType): Promise<string> {
    const answers = await inquirer.prompt({
        name: "id",
        type: "input",
        message: `Enter the ${scope} ID`,
    })

    return answers.id
}
