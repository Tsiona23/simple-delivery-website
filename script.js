class ZiExpress {
    constructor() {
        this.services = [
            {
                id: 'flash',
                name: 'Flash Delivery',
                description: 'Super-fast delivery in under 15 minutes.',
                icon: 'fas fa-bolt',
                color: '#3b82f6',
                time: '15 minutes',
                basePrice: 19.99
            },
            {
                id: 'express',
                name: 'Express Delivery',
                description: 'Reliable delivery within 30 minutes.',
                icon: 'fas fa-shipping-fast',
                color: '#8b5cf6',
                time: '30 minutes',
                basePrice: 14.99
            },
            {
                id: 'standard',
                name: 'Standard Delivery',
                description: 'Economical delivery within 1-2 hours.',
                icon: 'fas fa-truck',
                color: '#06b6d4',
                time: '1-2 hours',
                basePrice: 9.99
            }
        ];
        
        this.packagePrices = {
            small: 0.8,
            medium: 1.0,
            large: 1.5,
            xl: 2.0
        };
        
        this.extraServices = {
            fragile: 5.99,
            giftwrap: 7.99
        };
        
        this.features = [
            {
                icon: 'fas fa-rocket',
                title: 'Lightning Fast',
                description: 'Average delivery time of 15 minutes'
            },
            {
                icon: 'fas fa-shield-alt',
                title: '100% Secure',
                description: 'Real-time tracking and insurance'
            },
            {
                icon: 'fas fa-star',
                title: 'Premium Service',
                description: 'Trained delivery professionals'
            },
            {
                icon: 'fas fa-headset',
                title: '24/7 Support',
                description: 'Always available to help'
            }
        ];
        
        this.currentBooking = null;
        this.currentPrice = 12.99;
        this.init();
    }
    
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.renderServices();
            this.renderFeatures();
            this.setupFormInteractivity();
            this.setupMobileMenu();
            this.setupAnimations();
            this.initializeCounters();
            this.setupPriceCalculator();
            this.updatePriceDisplay();
        });
    }
    
    setupEventListeners() {
        // Explore button
        const exploreBtn = document.getElementById('exploreBtn');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                this.scrollToSection('services');
            });
        }
        
        // CTA buttons
        document.querySelectorAll('.cta-button').forEach(btn => {
            btn.addEventListener('click', () => {
                this.scrollToSection('contact');
            });
        });
        
        // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId !== '#') {
                    this.scrollToSection(targetId.substring(1));
                }
            });
        });
        
        // Form submission
        const form = document.getElementById('deliveryForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
        
        // Service selection from cards
        document.addEventListener('click', (e) => {
            if (e.target.closest('.service-btn')) {
                const serviceId = e.target.closest('.service-btn').dataset.service;
                this.selectService(serviceId);
                this.scrollToSection('contact');
            }
        });
    }
    
    setupFormInteractivity() {
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const addressInput = document.getElementById('address');
        const serviceSelect = document.getElementById('serviceType');
        const packageSelect = document.getElementById('packageType');
        const fragileCheckbox = document.getElementById('fragile');
        const giftwrapCheckbox = document.getElementById('giftwrap');
        
        // Make all inputs very forgiving
        [nameInput, phoneInput, addressInput].forEach(input => {
            if (input) {
                input.addEventListener('input', (e) => {
                    // Remove any error styling
                    e.target.classList.remove('error');
                    // Add success styling if there's any content
                    if (e.target.value.trim().length > 0) {
                        e.target.classList.add('success');
                        setTimeout(() => {
                            e.target.classList.remove('success');
                        }, 1000);
                    }
                    this.updatePrice();
                });
            }
        });
        
        // Service selection
        if (serviceSelect) {
            serviceSelect.addEventListener('change', (e) => {
                const service = this.services.find(s => s.id === e.target.value);
                if (service) {
                    e.target.classList.remove('error');
                    e.target.classList.add('success');
                    setTimeout(() => {
                        e.target.classList.remove('success');
                    }, 1000);
                    
                    this.showServiceInfo(service);
                    this.updatePrice();
                    this.showNotification(`✅ Selected ${service.name} service`, service.color);
                }
            });
        }
        
        // Package type change
        if (packageSelect) {
            packageSelect.addEventListener('change', () => {
                this.updatePrice();
            });
        }
        
        // Checkboxes
        if (fragileCheckbox) {
            fragileCheckbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.showNotification('🧸 Fragile items will get extra care (+$5.99)', '#06b6d4');
                }
                this.updatePrice();
            });
        }
        
        if (giftwrapCheckbox) {
            giftwrapCheckbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.showNotification('🎁 Gift wrapping added to order (+$7.99)', '#ec4899');
                }
                this.updatePrice();
            });
        }
    }
    
    setupPriceCalculator() {
        // Calculate initial price
        this.calculatePrice();
    }
    
    calculatePrice() {
        let price = 12.99; // Default starting price
        
        // Get selected service
        const serviceSelect = document.getElementById('serviceType');
        if (serviceSelect && serviceSelect.value) {
            const service = this.services.find(s => s.id === serviceSelect.value);
            if (service) {
                price = service.basePrice;
            }
        }
        
        // Apply package multiplier
        const packageSelect = document.getElementById('packageType');
        if (packageSelect) {
            const multiplier = this.packagePrices[packageSelect.value] || 1;
            price *= multiplier;
        }
        
        // Add extra services
        const fragileCheckbox = document.getElementById('fragile');
        const giftwrapCheckbox = document.getElementById('giftwrap');
        
        if (fragileCheckbox && fragileCheckbox.checked) {
            price += this.extraServices.fragile;
        }
        
        if (giftwrapCheckbox && giftwrapCheckbox.checked) {
            price += this.extraServices.giftwrap;
        }
        
        // Add small service fee
        price += 2.99;
        
        this.currentPrice = price;
        return price;
    }
    
    updatePrice() {
        const newPrice = this.calculatePrice();
        this.currentPrice = newPrice;
        this.updatePriceDisplay();
    }
    
    updatePriceDisplay() {
        const costDisplay = document.getElementById('costDisplay');
        if (costDisplay) {
            // Animate the price change
            const currentDisplay = parseFloat(costDisplay.textContent.replace('$', '')) || 0;
            this.animatePriceChange(currentDisplay, this.currentPrice, costDisplay);
        }
    }
    
    animatePriceChange(start, end, element) {
        let current = start;
        const difference = end - start;
        const steps = 20;
        const increment = difference / steps;
        let step = 0;
        
        const update = () => {
            current += increment;
            step++;
            
            if (step >= steps) {
                current = end;
            }
            
            element.textContent = `$${current.toFixed(2)}`;
            
            // Add animation effect
            if (difference > 0) {
                element.style.color = '#10b981';
                element.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 300);
            } else if (difference < 0) {
                element.style.color = '#ef4444';
            }
            
            setTimeout(() => {
                element.style.color = '#3b82f6';
            }, 600);
            
            if (step < steps) {
                requestAnimationFrame(update);
            }
        };
        
        update();
    }
    
    showServiceInfo(service) {
        const serviceSelect = document.getElementById('serviceType');
        const timeDisplay = document.querySelector('.estimated-time');
        
        if (timeDisplay) {
            timeDisplay.remove();
        }
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'estimated-time fade-in';
        timeDiv.innerHTML = `
            <i class="fas fa-clock"></i>
            <span>Delivery in about ${service.time}</span>
            <span class="price-badge">$${service.basePrice.toFixed(2)}</span>
        `;
        timeDiv.style.cssText = `
            margin-top: 10px;
            padding: 8px 12px;
            background: ${service.color}15;
            border-radius: 8px;
            color: ${service.color};
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            border-left: 3px solid ${service.color};
        `;
        
        serviceSelect.parentElement.appendChild(timeDiv);
    }
    
    async handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // VERY FORGIVING VALIDATION - just check if fields have ANY content
        let hasEmptyFields = false;
        const requiredFields = ['name', 'phone', 'address', 'serviceType'];
        
        requiredFields.forEach(field => {
            const element = document.getElementById(field);
            if (element && !element.value.trim()) {
                element.classList.add('error');
                hasEmptyFields = true;
                setTimeout(() => {
                    element.classList.remove('error');
                }, 2000);
            }
        });
        
        if (hasEmptyFields) {
            this.showNotification('Please fill in all fields before ordering', '#ef4444', 'fas fa-exclamation-circle');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('.submit-btn');
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            <span>Calculating final price...</span>
        `;
        submitBtn.disabled = true;
        
        try {
            // Calculate final price
            const finalPrice = this.calculatePrice();
            
            // Process the order
            await this.processOrder(data, finalPrice);
            
            // Show SUCCESS message
            this.showOrderSuccess(data, finalPrice);
            
        } catch (error) {
            this.showNotification('Something went wrong. Please try again.', '#ef4444', 'fas fa-exclamation-circle');
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
        }
    }
    
    processOrder(data, finalPrice) {
        return new Promise((resolve) => {
            // Show fake progress
            const progressSteps = [
                'Calculating final price...',
                'Confirming availability...',
                'Assigning delivery agent...',
                'Finalizing order details...'
            ];
            
            const submitBtn = document.querySelector('.submit-btn');
            let step = 0;
            
            const progressInterval = setInterval(() => {
                if (step < progressSteps.length) {
                    submitBtn.innerHTML = `
                        <i class="fas fa-spinner fa-spin"></i>
                        <span>${progressSteps[step]}</span>
                    `;
                    step++;
                } else {
                    clearInterval(progressInterval);
                    
                    // Generate order details
                    const service = this.services.find(s => s.id === data.serviceType);
                    const packageType = document.getElementById('packageType').value;
                    const fragile = document.getElementById('fragile').checked ? 'Yes (+$5.99)' : 'No';
                    const giftwrap = document.getElementById('giftwrap').checked ? 'Yes (+$7.99)' : 'No';
                    
                    // Delivery Agent - Tsion H
                    const deliveryAgent = {
                        name: 'Tsion H',
                        rating: '5.0',
                        deliveries: '1,847',
                        experience: '3 years',
                        vehicle: 'Electric Scooter',
                        motto: 'Fast, safe, and always on time!'
                    };
                    
                    this.currentBooking = {
                        orderId: `ZI-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                        customerName: data.name,
                        phone: data.phone,
                        address: data.address,
                        service: service ? service.name : 'Delivery Service',
                        deliveryTime: service ? service.time : 'Soon',
                        packageType: packageType.charAt(0).toUpperCase() + packageType.slice(1),
                        fragile: fragile,
                        giftwrap: giftwrap,
                        orderTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                        orderDate: new Date().toLocaleDateString(),
                        estimatedArrival: this.getEstimatedArrivalTime(service ? service.time : '1-2 hours'),
                        deliveryAgent: deliveryAgent,
                        finalPrice: finalPrice,
                        breakdown: this.getPriceBreakdown(),
                        status: 'Confirmed & Processing',
                        message: 'Your order has been successfully placed!'
                    };
                    
                    setTimeout(() => resolve(this.currentBooking), 800);
                }
            }, 500);
        });
    }
    
    getPriceBreakdown() {
        const serviceSelect = document.getElementById('serviceType');
        const packageSelect = document.getElementById('packageType');
        const fragileCheckbox = document.getElementById('fragile');
        const giftwrapCheckbox = document.getElementById('giftwrap');
        
        let servicePrice = 12.99;
        let serviceName = 'Standard Delivery';
        
        if (serviceSelect && serviceSelect.value) {
            const service = this.services.find(s => s.id === serviceSelect.value);
            if (service) {
                servicePrice = service.basePrice;
                serviceName = service.name;
            }
        }
        
        const packageMultiplier = this.packagePrices[packageSelect.value] || 1;
        const packagePrice = servicePrice * packageMultiplier;
        const fragilePrice = (fragileCheckbox && fragileCheckbox.checked) ? this.extraServices.fragile : 0;
        const giftwrapPrice = (giftwrapCheckbox && giftwrapCheckbox.checked) ? this.extraServices.giftwrap : 0;
        const serviceFee = 2.99;
        
        return {
            service: { name: serviceName, price: servicePrice },
            package: { multiplier: packageMultiplier, adjustedPrice: packagePrice },
            fragile: fragilePrice,
            giftwrap: giftwrapPrice,
            serviceFee: serviceFee,
            subtotal: packagePrice,
            total: packagePrice + fragilePrice + giftwrapPrice + serviceFee
        };
    }
    
    getEstimatedArrivalTime(deliveryTime) {
        const now = new Date();
        if (deliveryTime.includes('15')) {
            now.setMinutes(now.getMinutes() + 15);
        } else if (deliveryTime.includes('30')) {
            now.setMinutes(now.getMinutes() + 30);
        } else {
            now.setHours(now.getHours() + 1.5);
        }
        return now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    
    showOrderSuccess(data, finalPrice) {
        const form = document.getElementById('deliveryForm');
        const confirmation = document.getElementById('confirmation');
        
        if (!confirmation || !this.currentBooking) return;
        
        // Create SUCCESS message with user controls
        confirmation.innerHTML = `
            <div class="confirmation-header">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>🎉 ORDER SUCCESSFUL!</h2>
                <p class="success-subtitle">Your ZiExpress delivery has been confirmed</p>
                <div class="final-price-banner">
                    <span class="final-price-label">FINAL PRICE:</span>
                    <span class="final-price-amount">$${finalPrice.toFixed(2)}</span>
                </div>
            </div>
            
            <div class="order-receipt">
                <div class="receipt-header">
                    <h3><i class="fas fa-receipt"></i> Order Receipt</h3>
                    <span class="order-status-badge">PAID & CONFIRMED</span>
                </div>
                
                <div class="receipt-details">
                    <div class="detail-row">
                        <span class="detail-label">Order ID:</span>
                        <span class="detail-value order-id">${this.currentBooking.orderId}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Customer:</span>
                        <span class="detail-value">${this.currentBooking.customerName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Phone:</span>
                        <span class="detail-value">${this.currentBooking.phone}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Service:</span>
                        <span class="detail-value service-badge">${this.currentBooking.service}</span>
                    </div>
                    
                    <!-- Price Breakdown -->
                    <div class="price-breakdown-section">
                        <h4><i class="fas fa-calculator"></i> Price Breakdown</h4>
                        <div class="breakdown-item">
                            <span>${this.currentBooking.breakdown.service.name}:</span>
                            <span>$${this.currentBooking.breakdown.service.price.toFixed(2)}</span>
                        </div>
                        <div class="breakdown-item">
                            <span>Package (${this.currentBooking.packageType}):</span>
                            <span>x${this.currentBooking.breakdown.package.multiplier.toFixed(1)}</span>
                        </div>
                        ${this.currentBooking.fragile.includes('Yes') ? `
                        <div class="breakdown-item">
                            <span><i class="fas fa-glass-whiskey"></i> Fragile Handling:</span>
                            <span>+$${this.currentBooking.breakdown.fragile.toFixed(2)}</span>
                        </div>
                        ` : ''}
                        ${this.currentBooking.giftwrap.includes('Yes') ? `
                        <div class="breakdown-item">
                            <span><i class="fas fa-gift"></i> Gift Wrapping:</span>
                            <span>+$${this.currentBooking.breakdown.giftwrap.toFixed(2)}</span>
                        </div>
                        ` : ''}
                        <div class="breakdown-item">
                            <span><i class="fas fa-concierge-bell"></i> Service Fee:</span>
                            <span>+$${this.currentBooking.breakdown.serviceFee.toFixed(2)}</span>
                        </div>
                        <div class="breakdown-total">
                            <span><strong>Final Price:</strong></span>
                            <span class="total-amount"><strong>$${finalPrice.toFixed(2)}</strong></span>
                        </div>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Delivery Address:</span>
                        <span class="detail-value address">${this.currentBooking.address}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Package Type:</span>
                        <span class="detail-value">${this.currentBooking.packageType}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Fragile Items:</span>
                        <span class="detail-value">${this.currentBooking.fragile}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Gift Wrapping:</span>
                        <span class="detail-value">${this.currentBooking.giftwrap}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Order Time:</span>
                        <span class="detail-value">${this.currentBooking.orderTime}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Order Date:</span>
                        <span class="detail-value">${this.currentBooking.orderDate}</span>
                    </div>
                    <div class="detail-row highlight">
                        <span class="detail-label">Estimated Arrival:</span>
                        <span class="detail-value arrival-time">${this.currentBooking.estimatedArrival}</span>
                    </div>
                    
                    <!-- Delivery Agent Section -->
                    <div class="agent-section">
                        <h4><i class="fas fa-biking"></i> Your Delivery Agent</h4>
                        <div class="agent-card">
                            <div class="agent-avatar">
                                <i class="fas fa-user-circle"></i>
                            </div>
                            <div class="agent-info">
                                <div class="agent-name">${this.currentBooking.deliveryAgent.name}</div>
                                <div class="agent-details">
                                    <span class="agent-rating">⭐ ${this.currentBooking.deliveryAgent.rating}/5.0</span>
                                    <span class="agent-deliveries">${this.currentBooking.deliveryAgent.deliveries} deliveries</span>
                                    <span class="agent-experience">${this.currentBooking.deliveryAgent.experience} experience</span>
                                </div>
                                <div class="agent-vehicle">
                                    <i class="fas fa-motorcycle"></i> ${this.currentBooking.deliveryAgent.vehicle}
                                </div>
                                <div class="agent-motto">
                                    <i class="fas fa-quote-left"></i> ${this.currentBooking.deliveryAgent.motto}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="receipt-footer">
                    <p class="receipt-note">
                        <i class="fas fa-info-circle"></i>
                        ${this.currentBooking.deliveryAgent.name} will contact you shortly
                    </p>
                </div>
            </div>
            
            <div class="next-steps-card">
                <h4><i class="fas fa-list-check"></i> Next Steps</h4>
                <ul class="steps-list">
                    <li>
                        <i class="fas fa-phone incoming-call"></i>
                        <div>
                            <strong>Agent ${this.currentBooking.deliveryAgent.name} will call</strong>
                            <span>Within 2 minutes</span>
                        </div>
                    </li>
                    <li>
                        <i class="fas fa-biking"></i>
                        <div>
                            <strong>Pickup at your location</strong>
                            <span>By ${this.currentBooking.deliveryAgent.name}</span>
                        </div>
                    </li>
                    <li>
                        <i class="fas fa-map-marker-alt"></i>
                        <div>
                            <strong>Delivery en route</strong>
                            <span>Track in real-time</span>
                        </div>
                    </li>
                    <li>
                        <i class="fas fa-home"></i>
                        <div>
                            <strong>Package delivered</strong>
                            <span>By ${this.currentBooking.estimatedArrival}</span>
                        </div>
                    </li>
                </ul>
            </div>
            
            <div class="confirmation-actions">
                <button class="action-btn print-receipt-btn">
                    <i class="fas fa-print"></i>
                    <span>Print Receipt</span>
                </button>
                <button class="action-btn track-order-btn">
                    <i class="fas fa-map-marked-alt"></i>
                    <span>Track with ${this.currentBooking.deliveryAgent.name}</span>
                </button>
                <button class="action-btn close-confirmation-btn" id="closeConfirmationBtn">
                    <i class="fas fa-times"></i>
                    <span>Close & New Order</span>
                </button>
            </div>
            
            <div class="confirmation-footer">
                <p class="thank-you-message">
                    <i class="fas fa-heart"></i>
                    Thank you for choosing ZiExpress!
                </p>
                <p class="support-info">
                    Need help? Call <strong>1-800-ZIEXPRESS</strong> or email support@ziexpress.com
                </p>
            </div>
        `;
        
        // CELEBRATION EFFECTS
        this.showCelebration();
        
        // Play success sound
        this.playSuccessSound();
        
        // Show notification
        this.showNotification(
            `✅ ORDER CONFIRMED! Final price: $${finalPrice.toFixed(2)}`,
            '#10b981',
            'fas fa-check-circle'
        );
        
        // Show confirmation (hides form)
        if (form) form.style.display = 'none';
        confirmation.style.display = 'block';
        
        // Scroll to confirmation
        this.scrollToSection('contact');
        
        // Setup confirmation controls
        this.setupConfirmationControls();
    }
    
    setupConfirmationControls() {
        // Print receipt button
        const printBtn = document.querySelector('.print-receipt-btn');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                window.print();
                this.showNotification('📄 Receipt ready to print', '#3b82f6', 'fas fa-print');
            });
        }
        
        // Track order button (demo)
        const trackBtn = document.querySelector('.track-order-btn');
        if (trackBtn) {
            trackBtn.addEventListener('click', () => {
                this.showNotification(`📍 ${this.currentBooking.deliveryAgent.name} is on the way!`, '#8b5cf6', 'fas fa-map');
                this.startTrackingAnimation();
            });
        }
        
        // CLOSE CONFIRMATION button - user controls when to close
        const closeBtn = document.getElementById('closeConfirmationBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeConfirmationAndReset();
            });
        }
    }
    
    closeConfirmationAndReset() {
        const form = document.getElementById('deliveryForm');
        const confirmation = document.getElementById('confirmation');
        const submitBtn = form.querySelector('.submit-btn');
        
        // Reset form
        if (form) {
            form.reset();
            form.style.display = 'block';
            
            // Reset submit button
            submitBtn.innerHTML = `
                <i class="fas fa-bolt"></i>
                Confirm & Book Delivery
            `;
            submitBtn.disabled = false;
        }
        
        // Hide confirmation
        if (confirmation) {
            confirmation.style.display = 'none';
        }
        
        // Remove any visual feedback
        document.querySelectorAll('.success, .error').forEach(el => {
            el.classList.remove('success', 'error');
        });
        
        // Remove time display
        const timeDisplay = document.querySelector('.estimated-time');
        if (timeDisplay) timeDisplay.remove();
        
        // Reset price to default
        this.currentPrice = 12.99;
        this.updatePriceDisplay();
        
        // Show notification
        this.showNotification('📝 Ready for a new order!', '#3b82f6', 'fas fa-plus');
        
        // Scroll back to form
        this.scrollToSection('contact');
    }
    
    showCelebration() {
        // Add celebration styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatUp {
                0% { transform: translateY(30px) scale(0.9); opacity: 0; }
                100% { transform: translateY(0) scale(1); opacity: 1; }
            }
            
            @keyframes confettiFall {
                0% { transform: translateY(-100px) rotate(0deg); }
                100% { transform: translateY(100vh) rotate(360deg); }
            }
            
            @keyframes pulseGlow {
                0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
                50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.6); }
            }
            
            @keyframes incomingCall {
                0%, 100% { transform: scale(1); color: #10b981; }
                50% { transform: scale(1.2); color: #3b82f6; }
            }
            
            @keyframes pricePulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            .confirmation {
                animation: floatUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            
            .confirmation-header {
                animation: floatUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.1s both;
            }
            
            .order-receipt {
                animation: floatUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s both;
            }
            
            .next-steps-card {
                animation: floatUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s both;
            }
            
            .confirmation-actions {
                animation: floatUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.4s both;
            }
            
            .incoming-call {
                animation: incomingCall 2s infinite;
            }
            
            .order-status-badge {
                animation: pulseGlow 2s infinite;
            }
            
            .final-price-amount {
                animation: pricePulse 1s ease-in-out 3;
            }
        `;
        document.head.appendChild(style);
        
        // Add confetti
        this.createConfetti();
    }
    
    createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-celebration';
        confettiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
        `;
        
        const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
        const shapes = ['circle', 'square', 'triangle'];
        
        for (let i = 0; i < 80; i++) {
            const confetti = document.createElement('div');
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            
            confetti.style.cssText = `
                position: absolute;
                width: ${8 + Math.random() * 8}px;
                height: ${8 + Math.random() * 8}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -20px;
                left: ${Math.random() * 100}%;
                border-radius: ${shape === 'circle' ? '50%' : shape === 'triangle' ? '50% 50% 0 50%' : '2px'};
                animation: confettiFall ${1.5 + Math.random() * 2}s linear forwards;
                opacity: 0.9;
                transform: rotate(${Math.random() * 360}deg);
            `;
            confettiContainer.appendChild(confetti);
        }
        
        document.body.appendChild(confettiContainer);
        
        // Remove after animation
        setTimeout(() => {
            confettiContainer.remove();
        }, 3000);
    }
    
    startTrackingAnimation() {
        const trackingSteps = document.querySelectorAll('.tracking-step');
        if (trackingSteps.length === 0) return;
        
        // Reset all steps
        trackingSteps.forEach(step => {
            step.classList.remove('completed', 'active');
        });
        
        // Animate through steps
        let stepIndex = 0;
        const animateStep = () => {
            if (stepIndex < trackingSteps.length) {
                if (stepIndex > 0) {
                    trackingSteps[stepIndex - 1].classList.remove('active');
                    trackingSteps[stepIndex - 1].classList.add('completed');
                }
                trackingSteps[stepIndex].classList.add('active');
                stepIndex++;
                setTimeout(animateStep, 1500);
            }
        };
        
        animateStep();
    }
    
    playSuccessSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Play success melody
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
            oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            // Audio not supported - that's okay
        }
    }
    
    selectService(serviceId) {
        const service = this.services.find(s => s.id === serviceId);
        if (!service) return;
        
        const select = document.getElementById('serviceType');
        if (select) {
            select.value = serviceId;
            select.dispatchEvent(new Event('change'));
        }
    }
    
    renderServices() {
        const container = document.getElementById('servicesContainer');
        if (!container) return;
        
        container.innerHTML = this.services.map(service => `
            <div class="service-card fade-in">
                <div class="service-icon" style="background: linear-gradient(135deg, ${service.color}, ${this.lightenColor(service.color, 30)})">
                    <i class="${service.icon}"></i>
                </div>
                <div class="service-content">
                    <h3>${service.name}</h3>
                    <p class="service-time">
                        <i class="fas fa-clock"></i>
                        ${service.time}
                        <span class="service-price-badge">$${service.basePrice.toFixed(2)}</span>
                    </p>
                    <p>${service.description}</p>
                    <button class="service-btn" data-service="${service.id}">
                        <i class="fas fa-check-circle"></i>
                        Select This Service
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    renderFeatures() {
        const container = document.getElementById('featuresContainer');
        if (!container) return;
        
        container.innerHTML = this.features.map(feature => `
            <div class="feature-card fade-in">
                <i class="${feature.icon}"></i>
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
            </div>
        `).join('');
    }
    
    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        
        return `#${(
            0x1000000 +
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)
        ).toString(16).slice(1)}`;
    }
    
    showNotification(message, color = '#3b82f6', icon = 'fas fa-info-circle') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
            <button class="close-notification"><i class="fas fa-times"></i></button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.15);
            border-left: 5px solid ${color};
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 400px;
            font-weight: 500;
            font-size: 1.05rem;
        `;
        
        // Close button for notification
        const closeBtn = notification.querySelector('.close-notification');
        closeBtn.style.cssText = `
            margin-left: auto;
            background: none;
            border: none;
            color: #999;
            cursor: pointer;
            font-size: 1rem;
            padding: 4px 8px;
            border-radius: 50%;
            transition: background 0.3s;
        `;
        
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        });
        
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = '#f1f5f9';
        });
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-out forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    initializeCounters() {
        // Animate hero stats
        const counters = document.querySelectorAll('.hero .number');
        counters.forEach((counter, index) => {
            const target = index === 0 ? 15 : index === 1 ? 10000 : 24;
            let current = 0;
            const increment = target / 30;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current) + (index === 1 ? '+' : '');
            }, 50);
        });
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            window.scrollTo({
                top: section.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    }
    
    setupMobileMenu() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuBtn && navMenu) {
            menuBtn.addEventListener('click', () => {
                const isVisible = navMenu.style.display === 'flex';
                navMenu.style.display = isVisible ? 'none' : 'flex';
                
                if (!isVisible) {
                    navMenu.style.cssText = `
                        display: flex;
                        flex-direction: column;
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: white;
                        padding: 20px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                        z-index: 1000;
                        gap: 15px;
                        border-radius: 0 0 15px 15px;
                    `;
                }
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!menuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.style.display = 'none';
                }
            });
        }
    }
    
    setupAnimations() {
        // Add additional styles for confirmation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            /* Service Price Badge */
            .service-price-badge {
                background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                color: white;
                padding: 0.25rem 0.75rem;
                border-radius: 15px;
                font-size: 0.9rem;
                font-weight: 600;
                margin-left: 0.5rem;
            }
            
            .price-badge {
                background: #3b82f6;
                color: white;
                padding: 0.25rem 0.5rem;
                border-radius: 10px;
                font-size: 0.85rem;
                font-weight: 600;
                margin-left: auto;
            }
            
            /* Confirmation Styles */
            .confirmation-header {
                text-align: center;
                margin-bottom: 2rem;
            }
            
            .success-icon {
                font-size: 5rem;
                color: #10b981;
                margin-bottom: 1rem;
            }
            
            .confirmation-header h2 {
                font-size: 2.5rem;
                color: #1e293b;
                margin-bottom: 0.5rem;
            }
            
            .success-subtitle {
                color: #64748b;
                font-size: 1.2rem;
                margin-bottom: 1rem;
            }
            
            .final-price-banner {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 1rem 2rem;
                border-radius: 15px;
                display: inline-flex;
                align-items: center;
                gap: 1rem;
                margin-top: 1rem;
                box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
            }
            
            .final-price-label {
                font-weight: 600;
                font-size: 1.1rem;
            }
            
            .final-price-amount {
                font-size: 2.5rem;
                font-weight: 800;
            }
            
            .order-receipt {
                background: white;
                border-radius: 20px;
                padding: 2rem;
                margin: 2rem 0;
                border: 2px solid #e2e8f0;
                box-shadow: 0 10px 40px rgba(0,0,0,0.08);
            }
            
            .receipt-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
                padding-bottom: 1rem;
                border-bottom: 2px solid #e2e8f0;
            }
            
            .receipt-header h3 {
                color: #1e293b;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-size: 1.5rem;
            }
            
            .order-status-badge {
                background: #10b981;
                color: white;
                padding: 0.5rem 1.5rem;
                border-radius: 25px;
                font-weight: 700;
                font-size: 0.9rem;
                letter-spacing: 1px;
            }
            
            .receipt-details {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .detail-row {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                padding: 0.75rem 0;
                border-bottom: 1px solid #f1f5f9;
            }
            
            .detail-row:last-child {
                border-bottom: none;
            }
            
            .detail-row.highlight {
                background: #f0fdf4;
                padding: 1rem;
                border-radius: 10px;
                margin: 0.5rem -1rem;
                border: 1px solid #10b981;
            }
            
            .detail-label {
                color: #64748b;
                font-weight: 500;
                flex: 1;
            }
            
            .detail-value {
                color: #1e293b;
                font-weight: 600;
                flex: 2;
                text-align: right;
            }
            
            .order-id {
                font-family: 'Courier New', monospace;
                background: #f8fafc;
                padding: 0.25rem 0.75rem;
                border-radius: 6px;
                color: #3b82f6;
            }
            
            .service-badge {
                background: #3b82f6;
                color: white;
                padding: 0.25rem 0.75rem;
                border-radius: 15px;
                font-size: 0.9rem;
            }
            
            .address {
                max-width: 250px;
                word-break: break-word;
                text-align: left;
            }
            
            .arrival-time {
                color: #10b981;
                font-size: 1.2rem;
            }
            
            /* Price Breakdown */
            .price-breakdown-section {
                background: #f8fafc;
                border-radius: 15px;
                padding: 1.5rem;
                margin: 1.5rem 0;
                border: 1px solid #e2e8f0;
            }
            
            .price-breakdown-section h4 {
                color: #1e293b;
                margin-bottom: 1.5rem;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-size: 1.2rem;
            }
            
            .breakdown-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.75rem 0;
                border-bottom: 1px solid #e2e8f0;
                color: #64748b;
            }
            
            .breakdown-item:last-child {
                border-bottom: none;
            }
            
            .breakdown-item i {
                color: #3b82f6;
                margin-right: 0.5rem;
            }
            
            .breakdown-total {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem 0 0 0;
                margin-top: 1rem;
                border-top: 2px solid #3b82f6;
                color: #1e293b;
                font-size: 1.2rem;
            }
            
            .total-amount {
                color: #10b981;
                font-size: 1.5rem;
            }
            
            /* Delivery Agent Section */
            .agent-section {
                margin-top: 2rem;
                padding-top: 2rem;
                border-top: 2px solid #e2e8f0;
            }
            
            .agent-section h4 {
                color: #1e293b;
                margin-bottom: 1.5rem;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-size: 1.3rem;
            }
            
            .agent-card {
                background: white;
                border-radius: 15px;
                padding: 1.5rem;
                border: 2px solid #e2e8f0;
                display: flex;
                gap: 1.5rem;
                align-items: center;
            }
            
            .agent-avatar {
                font-size: 4rem;
                color: #3b82f6;
            }
            
            .agent-info {
                flex: 1;
            }
            
            .agent-name {
                font-size: 1.8rem;
                font-weight: 700;
                color: #1e293b;
                margin-bottom: 0.5rem;
            }
            
            .agent-details {
                display: flex;
                gap: 1rem;
                margin-bottom: 1rem;
                flex-wrap: wrap;
            }
            
            .agent-rating {
                background: #fef3c7;
                color: #92400e;
                padding: 0.25rem 0.75rem;
                border-radius: 15px;
                font-size: 0.9rem;
                font-weight: 600;
            }
            
            .agent-deliveries, .agent-experience {
                background: #e0f2fe;
                color: #075985;
                padding: 0.25rem 0.75rem;
                border-radius: 15px;
                font-size: 0.9rem;
            }
            
            .agent-vehicle {
                color: #64748b;
                margin-bottom: 0.5rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .agent-motto {
                font-style: italic;
                color: #6b7280;
                padding: 0.75rem;
                background: #f9fafb;
                border-radius: 10px;
                border-left: 3px solid #3b82f6;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .receipt-footer {
                margin-top: 1.5rem;
                padding-top: 1.5rem;
                border-top: 1px solid #e2e8f0;
                text-align: center;
            }
            
            .receipt-note {
                color: #64748b;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.75rem;
                font-size: 0.95rem;
            }
            
            .next-steps-card {
                background: #f8fafc;
                border-radius: 15px;
                padding: 1.5rem;
                margin: 1.5rem 0;
                border: 1px solid #e2e8f0;
            }
            
            .next-steps-card h4 {
                color: #1e293b;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-size: 1.2rem;
            }
            
            .steps-list {
                list-style: none;
                padding-left: 0;
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .steps-list li {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: white;
                border-radius: 10px;
                border-left: 4px solid #3b82f6;
            }
            
            .steps-list li i {
                font-size: 1.5rem;
                color: #3b82f6;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #dbeafe;
                border-radius: 50%;
            }
            
            .steps-list li div {
                flex: 1;
            }
            
            .steps-list li strong {
                display: block;
                color: #1e293b;
                margin-bottom: 0.25rem;
            }
            
            .steps-list li span {
                color: #64748b;
                font-size: 0.9rem;
            }
            
            .confirmation-actions {
                display: flex;
                gap: 1rem;
                margin: 2rem 0;
            }
            
            .action-btn {
                flex: 1;
                padding: 1rem;
                border: none;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.75rem;
                transition: all 0.3s ease;
                font-size: 1rem;
            }
            
            .print-receipt-btn {
                background: #3b82f6;
                color: white;
            }
            
            .print-receipt-btn:hover {
                background: #2563eb;
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(37, 99, 235, 0.3);
            }
            
            .track-order-btn {
                background: #8b5cf6;
                color: white;
            }
            
            .track-order-btn:hover {
                background: #7c3aed;
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(124, 58, 237, 0.3);
            }
            
            .close-confirmation-btn {
                background: #64748b;
                color: white;
            }
            
            .close-confirmation-btn:hover {
                background: #475569;
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(100, 116, 139, 0.3);
            }
            
            .confirmation-footer {
                text-align: center;
                margin-top: 2rem;
                padding-top: 2rem;
                border-top: 1px solid #e2e8f0;
            }
            
            .thank-you-message {
                color: #1e293b;
                font-size: 1.1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.75rem;
                margin-bottom: 1rem;
            }
            
            .thank-you-message i {
                color: #ef4444;
            }
            
            .support-info {
                color: #64748b;
                font-size: 0.9rem;
            }
            
            /* Live Price Updates */
            #costDisplay {
                transition: all 0.3s ease;
                display: inline-block;
            }
            
            @media (max-width: 768px) {
                .confirmation-actions {
                    flex-direction: column;
                }
                
                .detail-row {
                    flex-direction: column;
                    gap: 0.25rem;
                }
                
                .detail-value {
                    text-align: left;
                }
                
                .steps-list li {
                    flex-direction: column;
                    text-align: center;
                    gap: 0.75rem;
                }
                
                .steps-list li i {
                    align-self: center;
                }
                
                .agent-card {
                    flex-direction: column;
                    text-align: center;
                }
                
                .agent-details {
                    justify-content: center;
                }
                
                .final-price-amount {
                    font-size: 2rem;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.service-card, .feature-card').forEach(el => {
            observer.observe(el);
        });
    }
}

// Initialize the application
const app = new ZiExpress();

// Make it easy to test
window.placeTestOrder = function() {
    const form = document.getElementById('deliveryForm');
    if (form) {
        // Fill with dummy data for testing
        document.getElementById('name').value = 'Test Customer';
        document.getElementById('phone').value = '555-123-4567';
        document.getElementById('address').value = '123 Test Street, Sample City';
        document.getElementById('serviceType').value = 'express';
        document.getElementById('fragile').checked = true;
        
        // Submit the form
        form.dispatchEvent(new Event('submit'));
    }
};