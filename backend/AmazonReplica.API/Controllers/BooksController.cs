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
        public IEnumerable<Book> Get()
        {
            // This will now recognize 'Book' and '_amazonContext'
            return _amazonContext.Books.ToList();
        }
        [HttpGet("NonFictionBooks")]
        public IEnumerable<Book> GetFunctionalBooks()
        {
            var something = _amazonContext.Books.Where(b => b.Classification == "Non-Fiction").ToList();
            return something;
        }
    }
}