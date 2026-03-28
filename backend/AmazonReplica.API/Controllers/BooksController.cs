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
        public IActionResult Get(int pageSize = 5, int pageNum=1, string sort = "title_asc",[FromQuery] List<string>? bookTypes = null )
        {
            var query = _amazonContext.Books.AsQueryable();
            if (bookTypes != null && bookTypes.Any())
            {
                query = query.Where(b => bookTypes.Contains(b.Category));
            }


           

            if (sort == "title_asc")
            {
                query = query.OrderBy(b => b.Title);

            }

            else if (sort == "title_desc")
            {
                query = query.OrderByDescending(b => b.Title);
            }

            var totalNumBooks = query.Count();


            var something = query
                .Skip((pageNum -1)*pageSize).Take(pageSize).ToList();
             
            
            // This will now recognize 'Book' and '_amazonContext'
            var someObject = new 
            {
                Books = something,
                TotalNumBooks = totalNumBooks
            };

            return Ok(someObject);
        }

        [HttpGet("{bookId:int}")]
        public IActionResult GetBook(int bookId)
        {
            var book = _amazonContext.Books.Find(bookId);
            if (book == null)
            {
                return NotFound();
            }
            return Ok(book);
        }

        [HttpGet("GetBookTypes")]
        public IActionResult GetBookTypes ()
        {
            var bookCategories = _amazonContext.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();
            return Ok(bookCategories);
        }
    }
}