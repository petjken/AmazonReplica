using Microsoft.EntityFrameworkCore;


namespace AmazonReplica.API.Data
{

	public class AmazonDbContext : DbContext
	
	{
		public AmazonDbContext(DbContextOptions<AmazonDbContext> options) : base(options)
		{ 
		}
		public DbSet<Book> Books { get; set; }
	}
		
	
}