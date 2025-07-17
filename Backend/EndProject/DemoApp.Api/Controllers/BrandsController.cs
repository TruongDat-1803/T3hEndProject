using Microsoft.AspNetCore.Mvc;
using DemoApp.Application.Interfaces;
using DemoApp.Application.DTOs.Brands;
using Microsoft.AspNetCore.Authorization;

namespace DemoApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BrandsController : ControllerBase
    {
        private readonly IBrandService _brandService;

        public BrandsController(IBrandService brandService)
        {
            _brandService = brandService;
        }

        /// <summary>
        /// Get all brands
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BrandDto>>> GetBrands()
        {
            try
            {
                var brands = await _brandService.GetAllBrandsAsync();
                return Ok(brands);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving brands.", error = ex.Message });
            }
        }

        /// <summary>
        /// Get brand by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<BrandDto>> GetBrand(int id)
        {
            try
            {
                var brand = await _brandService.GetBrandByIdAsync(id);
                if (brand == null)
                    return NotFound(new { message = $"Brand with ID {id} not found." });

                return Ok(brand);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the brand.", error = ex.Message });
            }
        }

        /// <summary>
        /// Get brand by name
        /// </summary>
        [HttpGet("name/{name}")]
        public async Task<ActionResult<BrandDto>> GetBrandByName(string name)
        {
            try
            {
                var brand = await _brandService.GetBrandByNameAsync(name);
                if (brand == null)
                    return NotFound(new { message = $"Brand with name {name} not found." });

                return Ok(brand);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the brand.", error = ex.Message });
            }
        }

        /// <summary>
        /// Create a new brand
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<BrandDto>> CreateBrand(CreateBrandDto createBrandDto)
        {
            try
            {
                var brand = await _brandService.CreateBrandAsync(createBrandDto);
                return CreatedAtAction(nameof(GetBrand), new { id = brand.BrandId }, brand);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the brand.", error = ex.Message });
            }
        }

        /// <summary>
        /// Update a brand
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<BrandDto>> UpdateBrand(int id, UpdateBrandDto updateBrandDto)
        {
            try
            {
                var brand = await _brandService.UpdateBrandAsync(id, updateBrandDto);
                return Ok(brand);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the brand.", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete a brand
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBrand(int id)
        {
            try
            {
                var result = await _brandService.DeleteBrandAsync(id);
                if (!result)
                    return NotFound(new { message = $"Brand with ID {id} not found." });

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the brand.", error = ex.Message });
            }
        }

        /// <summary>
        /// Check if brand name is unique
        /// </summary>
        [HttpGet("check-name/{name}")]
        public async Task<ActionResult<bool>> CheckBrandNameUnique(string name)
        {
            try
            {
                var isUnique = await _brandService.IsBrandNameUniqueAsync(name);
                return Ok(isUnique);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while checking brand name uniqueness.", error = ex.Message });
            }
        }

        /// <summary>
        /// Get product count for brand
        /// </summary>
        [HttpGet("{id}/product-count")]
        public async Task<ActionResult<int>> GetBrandProductCount(int id)
        {
            try
            {
                var count = await _brandService.GetBrandProductCountAsync(id);
                return Ok(count);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving brand product count.", error = ex.Message });
            }
        }
    }
} 