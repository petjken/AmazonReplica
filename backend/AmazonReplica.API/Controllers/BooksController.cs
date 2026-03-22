using Microsoft.AspNetCore.Mvc;
using AmazonReplica.API.Data; // <--- THIS FIXES THE ERRORS

namespace AmazonReplica.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly AmazonDbContext _amazonContext;

        public BooksController(AmazonDbContext temp)
        {
            _amazonContext = temp;
        }

        [HttpGet("AllBooks")]
        public IActionResult Get(int pageSize = 5, int pageNum=1, string sort = "title_asc")
        {

            var query = _amazonContext.Books.AsQueryable();

            if (sort == "title_asc")
            {
                query = query.OrderBy(b => b.Title);

            }

            else if (sort == "title_desc")
            {
                query = query.OrderByDescending(b => b.Title);
            }
            
            var something = query
                .Skip((pageNum -1)*pageSize).Take(pageSize).ToList();
             
            var totalNumBooks = _amazonContext.Books.Count();
            // This will now recognize 'Book' and '_amazonContext'
            var someObject = new 
            {
                Books = something,
                TotalNumBooks = totalNumBooks
            };

            return Ok(someObject);
        }

        [HttpGet("NonFictionBooks")]
        public IEnumerable<Book> GetFunctionalBooks()
        {
            var something = _amazonContext.Books.Where(b => b.Classification == "Non-Fiction").ToList();
            return something;
        }
    }
}