$(document).ready(function () {
        $.ajax({
          url: 'https://smileschool-api.hbtn.info/quotes',
          method: 'GET',
          beforeSend: function () {
            $('.loader').show();
          },
          success: function (data) {
            if (data && data.length > 0) {
              const carouselInner = $('<div class="carousel-inner"></div>');

              data.forEach((quote, index) => {
                const activeClass = index === 0 ? ' active' : '';
                const item = `
                  <div class="carousel-item${activeClass}">
                    <div class="row mx-auto align-items-center">
                      <div class="col-12 col-sm-2 col-lg-2 offset-lg-1 text-center">
                        <img src="${quote.pic_url}" class="d-block align-self-center" alt="Quote image">
                      </div>
                      <div class="col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0">
                        <div class="quote-text">
                          <p class="text-white">« ${quote.text} »</p>
                          <h4 class="text-white font-weight-bold">${quote.name}</h4>
                          <span class="text-white">${quote.title}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                `;
                carouselInner.append(item);
              });

              const carousel = `
                <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                  ${carouselInner.prop('outerHTML')}
                  <a class="carousel-control-prev arrow-left" href="#carouselExampleControls" role="button" data-slide="prev">
                    <img src="images/arrow_white_left.png" alt="Quote Previous" aria-hidden="true">
                    <span class="sr-only">Previous</span>
                  </a>
                  <a class="carousel-control-next arrow-right" href="#carouselExampleControls" role="button" data-slide="next">
                    <img src="images/arrow_white_right.png" alt="Quote Next" aria-hidden="true">
                    <span class="sr-only">Next</span>
                  </a>
                </div>
              `;

              $('#quotes-carousel').html(carousel).show();
            }
          },
          error: function () {
            $('#quotes-carousel').html('<p class="text-white text-center">Erreur de chargement des citations.</p>').show();
          },
          complete: function () {
            $('.loader').hide();
          }
        });
      });

      // Generic card-by-card carousel for Bootstrap 4
      function setupCardCarousel(carouselSelector, cardSelector, getCardsPerSlide) {
        var $carousel = $(carouselSelector);
        var $inner = $carousel.find('.carousel-inner');
        var $cards = $inner.find(cardSelector);

        function updateCarousel() {
          var cardsPerSlide = getCardsPerSlide();
          var totalCards = $cards.length;
          $inner.empty();
          for (var i = 0; i < totalCards; i += cardsPerSlide) {
            var $item = $('<div class="carousel-item"></div>');
            // Ajout d'un conteneur flex pour aligner horizontalement
            var $row = $('<div class="d-flex justify-content-center w-100"></div>');
            for (var j = 0; j < cardsPerSlide && (i + j) < totalCards; j++) {
              $row.append($cards.eq(i + j).clone());
            }
            $item.append($row);
            if (i === 0) $item.addClass('active');
            $inner.append($item);
          }
        }

        // Responsive: update on resize
        $(window).on('resize', function() {
          updateCarousel();
        });

        updateCarousel();
      }

      // Helper: get cards per slide based on screen size
      function getPopularCardsPerSlide() {
        if (window.innerWidth >= 992) return 4;
        if (window.innerWidth >= 768) return 2;
        return 1;
      }

      $(function() {
        // Load popular tutorials
        $.ajax({
          url: 'https://smileschool-api.hbtn.info/popular-tutorials',
          method: 'GET',
          success: function(data) {
            var $inner = $('#popular-carousel-inner');
            $inner.empty();
            data.forEach(function(tutorial) {
              var stars = '';
              for (var i = 1; i <= 5; i++) {
                stars += '<img src="images/star_' + (i <= tutorial.star ? 'on' : 'off') + '.png" alt="star" width="15px"/>';
              }
              var card = `
                <div class="card popular-card mx-auto" style="min-width:250px;max-width:320px;">
                  <img src="${tutorial.thumb_url}" class="card-img-top" alt="Video thumbnail"/>
                  <div class="card-img-overlay text-center">
                    <img src="images/play.png" alt="Play" width="64px" class="align-self-center play-overlay"/>
                  </div>
                  <div class="card-body">
                    <h5 class="card-title font-weight-bold">${tutorial.title}</h5>
                    <p class="card-text text-muted">${tutorial['sub-title']}</p>
                    <div class="creator d-flex align-items-center">
                      <img src="${tutorial.author_pic_url}" alt="Creator of Video" width="30px" class="rounded-circle"/>
                      <h6 class="pl-3 m-0 main-color">${tutorial.author}</h6>
                    </div>
                    <div class="info pt-3 d-flex justify-content-between">
                      <div class="rating">${stars}</div>
                      <span class="main-color">${tutorial.duration}</span>
                    </div>
                  </div>
                </div>
              `;
              $inner.append($(card));
            });

            // Setup carousel (card by card, responsive)
            setupCardCarousel('#carouselExampleControls2', '.popular-card', getPopularCardsPerSlide);
          },
          error: function() {
            $('#popular-carousel-inner').html('<div class="text-danger text-center w-100">Failed to load tutorials.</div>');
          }
        });
      });