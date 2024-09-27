class OutputProcessor {
    write(content) {
        if (Array.isArray(content)) {
            this.writeLines(content);
        } else {
            this.writeLine(content);
        }
    }

    writeLine(line) {
        console.log(line);
    }

    writeLines(lines) {
        lines.forEach((line) => {
            this.writeLine(line);
        });
    }
}

module.exports = OutputProcessor;
