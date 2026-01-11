type LogLevel = 'info' | 'warn' | 'error'

export interface LogEntry {
    timestamp: number
    level: LogLevel
    message: string
    data?: any
}

type Listener = (logs: LogEntry[]) => void

class DebugLogger {
    private logs: LogEntry[] = []
    private listeners: Set<Listener> = new Set()
    private maxLogs = 100

    log(level: LogLevel, message: string, data?: any) {
        const entry: LogEntry = {
            timestamp: Date.now(),
            level,
            message,
            data
        }
        
        this.logs = [entry, ...this.logs].slice(0, this.maxLogs)
        this.notify()
        
        // Also log to browser console
        const args = data ? [message, data] : [message]
        if (level === 'error') console.error(`[Debug]`, ...args)
        else if (level === 'warn') console.warn(`[Debug]`, ...args)
        else console.log(`[Debug]`, ...args)
    }

    info(message: string, data?: any) { this.log('info', message, data) }
    warn(message: string, data?: any) { this.log('warn', message, data) }
    error(message: string, data?: any) { this.log('error', message, data) }

    getLogs() { return this.logs }

    subscribe(listener: Listener) {
        this.listeners.add(listener)
        return () => this.listeners.delete(listener)
    }

    notify() {
        this.listeners.forEach(l => l(this.logs))
    }
    
    clear() {
        this.logs = []
        this.notify()
    }
}

export const debugLogger = new DebugLogger()
