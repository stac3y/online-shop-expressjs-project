exports.getError = (req, res, next) => {
    res.status(404).render('error-404', {docTitle: 'Page Not Found', path: null})
}