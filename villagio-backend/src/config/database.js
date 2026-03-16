module.exports = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/villagio',
  options: {
    autoIndex: true, // Let mongoose build indexes based on schema definitions
  }
}
