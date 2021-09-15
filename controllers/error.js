exports.getError404 = (req, res, next) => {
    res.status(404).render('error-404', {docTitle: 'Page Not Found', path: '/404'})
}
exports.getError500 = (req, res, next) => {
    res.status(500).render('error-500', {docTitle: 'Error', path: '/500'})
}