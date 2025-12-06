const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  getAllContent,
  getContentBySection,
  updateContent,
  getAllServices,
  createService,
  updateService,
  deleteService,
  getAllPricingPlans,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getAllFeatures,
  createFeature,
  updateFeature,
  deleteFeature,
  getAllStats,
  createStat,
  updateStat,
  deleteStat
} = require('../controllers/contentController');

// All routes are protected
router.use(authMiddleware);

// Content sections
router.get('/', getAllContent);
router.get('/sections/:section', getContentBySection);
router.put('/sections/:section', updateContent);

// Services
router.get('/services', getAllServices);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

// Pricing plans
router.get('/pricing', getAllPricingPlans);
router.post('/pricing', createPricingPlan);
router.put('/pricing/:id', updatePricingPlan);
router.delete('/pricing/:id', deletePricingPlan);

// Testimonials
router.get('/testimonials', getAllTestimonials);
router.post('/testimonials', createTestimonial);
router.put('/testimonials/:id', updateTestimonial);
router.delete('/testimonials/:id', deleteTestimonial);

// Features
router.get('/features', getAllFeatures);
router.post('/features', createFeature);
router.put('/features/:id', updateFeature);
router.delete('/features/:id', deleteFeature);

// Stats
router.get('/stats', getAllStats);
router.post('/stats', createStat);
router.put('/stats/:id', updateStat);
router.delete('/stats/:id', deleteStat);

module.exports = router;
