function spawn() {
    return new Promise((resolve, reject) => {
        let p: Deno.Command | null = new Deno.Command(Deno.execPath(), {
            args: ["run", "--unstable", "-A", "./main.ts"],
            cwd: Deno.cwd(),
            stdout: "piped",
            stderr: "piped",
        })

        console.log("starting");
        p.spawn();

        setTimeout(() => {
            console.log("killing");
            p = null;
            resolve("done");
        }, 60 * 60 * 1000);
    });
}

spawn();
setInterval(spawn, 60 * 60 * 1000);