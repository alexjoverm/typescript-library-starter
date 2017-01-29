interface Logger extends Console {
  group(title: string, options?: string)
}

export const logger = console as Logger
