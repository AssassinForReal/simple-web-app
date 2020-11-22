const fs = require('fs/promises')
const storage = require('./storage')

const userMenu = [
  { url: '/', name: 'Home' },
  { url: '/register', name: 'Register' },
  { url: '/login', name: 'Login' },
  { url: '/admin', name: 'Admin' },
]

const adminMenu = [
  { url: '/sort', name: 'Sort' },
  { url: '/gender', name: 'Gender' },
  { url: '/show', name: 'Show' },
]

const logOutItem = { url: '/logout', name: 'Logout' }

const engine = async (path, options, callback) => {
  try {
    const main = await fs.readFile('views/main.html')
    const mainContent = main.toString()

    const header = await fs.readFile('views/header.html')
    
    const userMenuContent = [...userMenu, storage.isLogged && logOutItem].reduce((previous, current) => {
      if (!current) return previous
      return previous + `
        <li>
          <a href="${current.url}" ${options.url === current.url ? 'class="active"' : ''}>${current.name}</a>
        </li>
      `
    }, '')

    const headerContent = header.toString().replace('{{ menu }}', userMenuContent)

    const view = await fs.readFile(path)
    let viewContent = view.toString()

    if (options.admin) {
      const admin = await fs.readFile('views/admin/main.html')
      const adminContent = admin.toString()

      const adminMenuContent = adminMenu.reduce((previous, current) => {
        return previous + `
          <li>
            <a href="${current.url}" ${options.url === current.url ? 'class="active"' : ''}>${current.name}</a>
          </li>
        `
      }, '')

      viewContent = adminContent
        .replace('{{ content }}', viewContent)
        .replace('{{ menu }}', adminMenuContent)
    }

    const rawContent = mainContent.replace('{{ content }}', headerContent + viewContent)

    const content = Object.entries(options)
      .reduce((previous, [key, value]) => {
        if (typeof value === 'object') return previous
        return previous.replace(new RegExp(`{{ ${key} }}`, 'g'), value)
      }, rawContent)

    callback(null, content)
  } catch (err) {
    callback(err)
  }
}

module.exports = engine
