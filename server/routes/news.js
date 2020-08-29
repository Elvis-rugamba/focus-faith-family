module.exports.getNews = async (req, res, next) => {
    // Get all the entries of content type course
    let courses = []
    let categories = []
    courses = await getCourses(res.locals.currentLocale.code, res.locals.currentApi.id)
    // Attach entry state flags when using preview API
    if (shouldAttachEntryState(res)) {
      courses = await attachEntryStateToCourses(courses)
    }
  
    categories = await getCategories(res.locals.currentLocale.code, res.locals.currentApi.id)
    res.render('courses', {
      title: `${translate('allCoursesLabel', res.locals.currentLocale.code)} (${courses.length})`,
      categories,
      courses
    })
  }