import { spawn } from "child_process";

export default function (url: string, path: string, outName: string) {
    const command = `curl -Ls --output ${outName} '${url}'`;
    spawn(command, {
        cwd: path,
        shell: true,
    });
}
